from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, ProductViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import BuyerOrderView, SupplierOrderView, SupplierOrderUpdateView

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/me/', MeView.as_view()),

    path('', include(router.urls)),
]

urlpatterns += [
    path('orders/buyer/', BuyerOrderView.as_view()),
    path('orders/supplier/', SupplierOrderView.as_view()),
    path('orders/<int:pk>/status/', SupplierOrderUpdateView.as_view()),
]
from .views import SupplierAnalyticsView

urlpatterns += [
    path('analytics/supplier/', SupplierAnalyticsView.as_view()),
]
