from django.db.models import Q, Sum, F

from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import User, Product, Order, OrderItem
from .serializers import (
    RegisterSerializer,
    ProductSerializer,
    OrderSerializer,
    OrderStatusSerializer,
)
from .permissions import IsSupplierOrReadOnly
from .order_permissions import IsBuyer, IsSupplier


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
    page_size = 9  # 9 items per page for grid
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSupplierOrReadOnly]
    pagination_class = ProductPagination

    def get_queryset(self):
        queryset = Product.objects.all()
        user = self.request.user

        # Query params
        search = self.request.query_params.get("search")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        supplier = self.request.query_params.get("supplier")
        category = self.request.query_params.get("category")

        # Supplier = me
        if supplier == "me" and user.is_authenticated:
            queryset = queryset.filter(supplier=user)

        # Category
        if category:
            queryset = queryset.filter(category=category)

        # Search by name or description
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )

        # Price filters
        try:
            if min_price:
                queryset = queryset.filter(price__gte=float(min_price))

            if max_price:
                queryset = queryset.filter(price__lte=float(max_price))
        except (ValueError, TypeError):
            pass

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(supplier=self.request.user)

class BuyerOrderView(ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsBuyer]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class SupplierOrderView(ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsSupplier]

    def get_queryset(self):
        return Order.objects.filter(
            items__product__supplier=self.request.user
        ).distinct()

class SupplierOrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [IsAuthenticated, IsSupplier]

    def get_queryset(self):
        return Order.objects.filter(
            items__product__supplier=self.request.user
        ).distinct()

class SupplierAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsSupplier]

    def get(self, request):
        supplier = request.user

        order_items = OrderItem.objects.filter(
            product__supplier=supplier
        )

        total_revenue = order_items.aggregate(
            revenue=Sum(F("price") * F("quantity"))
        )["revenue"] or 0

        total_orders = order_items.values("order").distinct().count()

        best_products = (
            order_items
            .values("product__name")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold")
        )

        return Response({
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "best_selling_products": best_products
        })
