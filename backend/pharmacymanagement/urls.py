from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("create_user", views.create_user, name="create_user"),
    path("login", views.login, name="login"),
    path("add_to_stock", views.add_to_stock, name="add_to_stock"),
    path("remove_from_stock", views.remove_from_stock, name="remove_from_stock"),
    path("drug/<id>", views.get_drug, name="get_drug"),
    path("get_all_users", views.get_all_users, name="get_all_users"),
    path("get_all_customers", views.get_all_customers, name="get_all_customers"),
    path("get_all_providers", views.get_all_providers,name="get_all_providers"),
    path("get_drugs", views.get_drugs, name="get_drugs"),
    path("add_medicine/", views.add_medicine, name="add_medicine"),
    path("get_bill/<bill_id>", views.get_bill, name="get_bill"),
    path("generate_bill", views.generate_bill, name="generate_bill"),
    path("get_low_stock_drugs/", views.get_low_stock_drugs,
         name="get_low_stock_drugs"),
    path("get_expiring_drugs/", views.get_expiring_drugs,
         name="get_expiring_drugs"),
    path("get_expired_drugs", views.get_expired_drugs, name="get_expired_drugs"),
    path("get_daily_report", views.get_daily_report, name="get_daily_report"),
    path("get_report/<report_date>/", views.get_day_report, name="get_day_report"),
    path(
        "get_report/<report_start_date>/<report_end_date>",
        views.get_report_between_days,
        name="get_report_between_days",
    ),
]
