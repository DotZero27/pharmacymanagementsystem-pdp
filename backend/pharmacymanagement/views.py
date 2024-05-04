from django.http import JsonResponse
from validations import is_valid_email, is_valid_password, is_valid_phone
from datetime import date, datetime
from JsonHandler import JsonHandler as JH
from Customer import Customer

# Constants
MIN_STOCK_COUNT = 50
MAX_EXPIRY_TIME_INTERVAL = 120
JSONHANDLER_INSTANCE = JH()


def login(request):
    """
    Handles user login.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response indicating success, unauthorized, or bad request.
    """
    if request.method == "POST":
        # Retrieve username and password from the request
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Read existing users from the JSON file
        users = JSONHANDLER_INSTANCE.read_content("users.json")

        # Check if the username exists
        if username in users:
            # Check if the provided password matches the stored password
            record_password = users[username]["password"]
            if password == record_password:
                _user = {"username":username,**users[username]}
                
                del _user['password']
                
                # Return success response for a valid login
                return JsonResponse(_user, status=200)

        # Return unauthorized response if login fails
        return JsonResponse({"response": "unauthorized"}, status=401)

    else:
        # Return bad request response for non-POST requests
        return JsonResponse({"response": "bad request"}, status=400)


def create_user(request):
    """
    Handles user registration.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response indicating success, conflict, or bad request.
    """
    if request.method == "POST":
        # Read existing users from the JSON file
        
        users = JSONHANDLER_INSTANCE.read_content("users.json")

        # Retrieve user registration details from the request
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        confirm_password = request.POST.get("confirmPassword")
        

        # Check for password match
        if password != confirm_password:
            return JsonResponse(
                {
                    "message": "Password and Confirm Password does not match!",
                },
                status=409,
            )

        # Check for existing username
        if username in users:
            return JsonResponse(
                { "message": "Username already exists!"},
                status=403,
            )
        
        # Check for existing email
        if any(user.get("email") == email for user in users.values()):
            return JsonResponse(
                {"message": "Email already exists!"},
                status=409,
            )
        
        # Validate email
        if not is_valid_email(email):
            return JsonResponse(
                {"message": "Invalid email!"}, status=409
            )

        # Validate password strength
        if not is_valid_password(password):
            return JsonResponse(
                {"message": "Password not strong enough!"},
                status=409,
            )

        # Create user data and update the users
        user_data = {username: {"email": email, "password": password}}
        users.update(user_data)

        # Write updated users to the JSON file
        JSONHANDLER_INSTANCE.write_content("users.json", users)

        # Return success response
        return JsonResponse(
            {
                "username": username,
                "email": email,
            },
            status=201,
        )

    else:
        # Return bad request response for non-POST requests
        return JsonResponse({"response": "bad request"}, status=400)


def add_to_stock(request):
    """
    Handles adding stock for a drug.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response indicating success or bad request.
    """
    if request.method == "POST":
        # Retrieve drug details from the request
        drug_id = request.POST.get("drug_id")
        drug_name = request.POST.get("drug_name")
        provider = request.POST.get("provider")
        expiry_date = request.POST.get("expiry_date")
        stock = int(request.POST.get("stock"))
        price = float(request.POST.get("price"))
        bin_number = request.POST.get("bin_number")
        batch_number = request.POST.get("batch_number")
        usage = request.POST.get("usage")
        side_effects = request.POST.get("side_effects")

        # Read existing stocks from the JSON file
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        # Check if the drug_id already exists in stocks
        if drug_id in stocks:
            current_drug = stocks[drug_id]

            # Extract existing drug details
            old_drug_name = current_drug["drug_name"]
            old_provider = current_drug["provider"]
            old_expiry_date = current_drug["expiry_date"]
            old_stock = int(current_drug["stock"])
            old_price = float(current_drug["price"])
            old_bin_number = current_drug["bin_number"]
            old_batch_number = current_drug["batch_number"]
            old_usage = current_drug["usage"]
            old_side_effects = current_drug["side_effects"]

            # Check if the new drug details match the existing details
            if (
                (old_drug_name == drug_name)
                and (old_provider == provider)
                and (old_expiry_date == expiry_date)
                and (old_price == price)
                and (old_bin_number == bin_number)
                and (old_batch_number == batch_number)
                and (old_usage == usage)
                and (old_side_effects == side_effects)
            ):
                old_stock += stock

            # Create a new stock entry
            temp = {
                "drug_name": drug_name,
                "provider": provider,
                "expiry_date": expiry_date,
                "stock": int(stock),
                "price": float(price),
                "bin_number": bin_number,
                "batch_number": batch_number,
                "usage":usage,
                "side_effects":side_effects
            }

            # Update the stocks with the new entry
            stocks[drug_id] = temp

        else:
            # Create a new stock entry if drug_id is not present in stocks
            temp = {
                "drug_name": drug_name,
                "provider": provider,
                "expiry_date": expiry_date,
                "stock": int(stock),
                "price": float(price),
                "bin_number": bin_number,
                "batch_number": batch_number,
                "usage":usage,
                "side_effects":side_effects
            }

            # Update the stocks with the new entry
            stocks[drug_id] = temp

        # Write the updated stocks to the JSON file
        JSONHANDLER_INSTANCE.write_content("stocks.json", stocks)

        # Return success response
        return JsonResponse(
            {
                "response": "resource created",
                "description": "Stock added successfully",
                "id": drug_id,
            },
            status=201,
        )
    else:
        # Return bad request response for non-POST requests
        return JsonResponse({"response": "bad request"}, status=400)


def remove_from_stock(request):
    """
    Handles removing stock for a drug.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response indicating success, not found, or bad request.
    """
    if request.method == "POST":
        # Retrieve drug details from the request
        drug_id = request.POST.get("drug_id")
        drug_name = request.POST.get("drug_name")
        batch_number = request.POST.get("batch_number")

        # Read existing stocks from the JSON file
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        # Check if the drug_id exists in stocks
        if drug_id not in stocks:
            return JsonResponse(
                {"response": "not found", "description": "DrugID not found"}, status=401
            )

        current_drug = stocks[drug_id]

        # Check if the drug_name and batch_number match
        if current_drug["drug_name"] == drug_name:
            if current_drug["batch_number"] == batch_number:
                # Delete the drug entry from stocks
                del stocks[drug_id]
            else:
                # Return not found response if batch_number does not match
                return JsonResponse(
                    {
                        "response": "not found",
                        "description": "Batch Number does not match",
                    },
                    status=404,
                )
        else:
            # Return not found response if drug_name does not match
            return JsonResponse(
                {"response": "not found", "description": "Drug Name does not match"},
                status=404,
            )

        # Write the updated stocks to the JSON file
        JSONHANDLER_INSTANCE.rewrite_content("stocks.json", stocks)

        # Return success response
        return JsonResponse(
            {"response": "ok", "description": "Stock deleted successfully!"}, status=204
        )
    else:
        # Return bad request response for non-POST requests
        return JsonResponse({"response": "bad request"}, status=400)

def get_drug(request,id):
    """
    Handles fetching individual drug detail.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response containing the list of drugs or bad request response.
    """
    
    if request.method == "GET":
        inventory = JSONHANDLER_INSTANCE.read_content("stocks.json")
        
        if inventory.get(id):
            drug = inventory[id]
            
            purchases = JSONHANDLER_INSTANCE.read_content("purchases.json")
            
            total_sales = 0.0
            total_quantity = 0

            for transaction_id, transaction_data in purchases.items():
                if "meds" in transaction_data and id in transaction_data["meds"]:
                    med_data = transaction_data["meds"][id]
                    total_sales += med_data["amountpayable"]
                    total_quantity += med_data["quantity"]

            lifetime_supply = total_quantity + drug["stock"]
            
            return JsonResponse({"drug_id":id,**drug,"lifetime_supply":lifetime_supply,"lifetime_sales":total_quantity})
        else:
            return JsonResponse({"message":'Drug not found'},status=401)
    
def get_drugs(request):
    """
    Handles fetching all drugs from the stock.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response containing the list of drugs or bad request response.
    """
    if request.method == "GET":
        # Read existing stocks from the JSON file
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        # Return success response with the list of drugs
        return JsonResponse(
            {"response": "ok", "description": "Fetched all drugs", "drugs": stocks},
            status=200,
        )
    else:
        # Return bad request response for non-GET requests
        return JsonResponse({"response": "bad request"}, status=400)


def add_medicine(request):
    """
    Handles adding a medicine to the customer's session and updating stock.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response indicating success, not found, quantity not sufficient,
        or drug details do not match.
    """
    if request.method == "POST":
        # Extract medicine details from the request
        drug_id = request.POST.get("drug_id")
        drug_name = request.POST.get("drug_name")
        provider = request.POST.get("provider")
        expiry_date = request.POST.get("expiry_date")
        requiredquantity = int(request.POST.get("required_quantity"))
        batch_number = request.POST.get("batch_number")

        # Read existing stocks from the JSON file
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        # Check if the drug exists in the stock
        if drug_id not in stocks:
            return JsonResponse(
                {
                    "code": 404,
                    "response": "not found",
                    "description": "DrugID not found",
                }
            )

        # Fetch details of the drug from the stock
        fdrug = stocks[drug_id]

        # Initialize drug price
        drug_price = 0

        # Check if the drug details match the stock
        if (
            (fdrug["drug_name"] == drug_name)
            and (fdrug["provider"] == provider)
            and (fdrug["expiry_date"] == expiry_date)
            and (fdrug["batch_number"] == batch_number)
        ):
            # Check if the stock has sufficient quantity
            if fdrug["quantity"] > requiredquantity:
                drug_price = fdrug["price"]

                # Update stock quantity
                stocks[drug_id]["stock"] = int(stocks[drug_id]["stock"]) - int(
                    requiredquantity
                )

                # Save the updated stock to the JSON file
                JSONHANDLER_INSTANCE.rewrite_content("stocks.json", stocks)
            else:
                return JsonResponse(
                    {"response": "Quantity not sufficient!"}, status=409
                )
        else:
            return JsonResponse({"response": "Drug details do not match!"}, status=404)

        # Check if the drug is already in the customer's session
        if drug_id in request.session["customer"]["meds"]:
            meds_of_customer = request.session["customer"]["meds"]
            sdrug = meds_of_customer[drug_id]

            # Check if the drug details in customer records match
            if (
                (sdrug["drug_name"] == drug_name)
                and (sdrug["provider"] == provider)
                and (sdrug["expiry_date"] == expiry_date)
                and (sdrug["batch_number"] == batch_number)
            ):
                # Update quantity and amount payable in customer records
                meds_of_customer[drug_id]["quantity"] = (
                    int(meds_of_customer[drug_id]["quantity"]) + requiredquantity
                )
                meds_of_customer["amountpayable"] = float(
                    meds_of_customer["amountpayable"]
                ) + (requiredquantity * drug_price)

                # Save the updated customer records
                request.session["customer"]["meds"] = meds_of_customer
                request.session.save()
            else:
                return JsonResponse(
                    {"response": "Drug details in customer records do not match!"},
                    status=404,
                )
        else:
            # Add a new entry for the drug in customer records
            sdrug = {
                "drug_name": drug_name,
                "provider": provider,
                "expiry_date": expiry_date,
                "batch_number": batch_number,
                "quantity": requiredquantity,
                "amountpayable": requiredquantity * drug_price,
            }

            request.session["customer"]["meds"].update({drug_id: sdrug})
            request.session.save()

        # Return success response
        return JsonResponse(
            {
                "response": "resource created",
                "description": "Drug added successfully",
                "drugID": drug_id,
            },
            status=201,
        )
    else:
        # Return bad request response for non-POST requests
        return JsonResponse({"response": "bad request"}, status=400)


def generate_bill(request):
    if request.method == "POST":
        customer_details = request.POST

        if customer_details is None:
            return JsonResponse(
                {"response": "not found", "description": "Customer data is not found"},
                status=404,
            )

        today = date.today()
        now = datetime.now()
        purchase_date = today.strftime("%Y/%m/%d")
        purchase_time = now.strftime("%I:%M %p")

        customer_name = customer_details.get("name")
        customer_mail = customer_details.get("email")
        customer_phone = customer_details.get("phone")

        meds_list = customer_details.getlist("meds")

        total_quantity = 0
        total_price = 0.0

        all_meds = {}

        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        for med in meds_list:
            quantity = med.get("quantity", 0)
            amountpayable = med.get("amountpayable", 0)
            drug_id = med.get("drug_id")

            if not drug_id:
                return JsonResponse(
                    {
                        "response": "bad request",
                        "description": "Invalid or missing drug_id",
                    },
                    status=400,
                )

            if drug_id in stocks:
                available_stock = stocks[drug_id].get("stock", 0)

                if quantity > available_stock:
                    return JsonResponse(
                        {
                            "response": "Insufficient stock",
                            "description": f"Insufficient stock for {med.get('drug_name')}",
                        },
                        status=400,
                    )

                stocks[drug_id]["stock"] -= quantity  # Update stock count

            total_quantity += quantity
            total_price += amountpayable

            if drug_id:
                all_meds[drug_id] = {
                    "drug_name": med.get("drug_name"),
                    "provider": med.get("provider"),
                    "expiry_date": med.get("expiry_date"),
                    "batch_number": med.get("batch_number"),
                    "quantity": quantity,
                    "amountpayable": amountpayable,
                }

        # Save the updated stock data
        JSONHANDLER_INSTANCE.write_content("stocks.json", stocks)

        existing_bills = JSONHANDLER_INSTANCE.read_content("purchases.json")
        bill_id = str(len(existing_bills) + 1)

        bill_details = {
            "customer_name": customer_name,
            "customer_email": customer_mail,
            "customer_phone": customer_phone,
            "meds": all_meds,
            "totalquantity": total_quantity,
            "totalamountpayable": total_price,
            "purchase_date": purchase_date,
            "purchase_time": purchase_time,
        }

        existing_bills[bill_id] = bill_details
        JSONHANDLER_INSTANCE.rewrite_content("purchases.json", existing_bills)

        customer = Customer(
            name=customer_name, email=customer_mail, phone=customer_phone, meds=all_meds
        )

        customer.notify(bill_details)

        return JsonResponse(
            {
                "response": "success",
                "description": "Bill generated successfully",
                "bill": {"id": bill_id, **bill_details},
            },
            status=200,
        )

    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_low_stock_drugs(request):
    if request.method == "GET":
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")

        low_stocks = {}

        for drug_id, drug_details in stocks.items():
            if drug_details["stock"] <= MIN_STOCK_COUNT:
                low_stocks.update({drug_id: drug_details})

        return JsonResponse(
            {"response": "ok", "description": "Low stock fetched", "drugs": low_stocks},
            status=200,
        )

    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_day_report(request, report_date):
    if request.method == "GET":
        purchases = JSONHANDLER_INSTANCE.read_content("purchases.json")

        report_date = report_date.replace("-", "/")

        daily_report = {}

        total_sales = 0

        for idx, bill_details in purchases.items():
            if bill_details["purchase_date"] == report_date:
                total_sales += bill_details["totalamountpayable"]
                daily_report.update({idx: bill_details})

        daily_report.update({"grand_total": total_sales})

        return JsonResponse(
            {
                "response": "ok",
                "description": "Day report fetched",
                "purchases": daily_report,
            },
            status=200,
        )

    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_daily_report(request):
    """
    Fetches the daily purchase report for the current date.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response containing the daily report or bad request.
    """
    return get_day_report(request, date.today().strftime("%Y/%m/%d"))


def is_date_between(start_date_str, end_date_str, target_date_str):
    """
    Checks if a target date is between start and end dates.

    Args:
        start_date_str (str): Start date string.
        end_date_str (str): End date string.
        target_date_str (str): Target date string.

    Returns:
        bool: True if the target date is between start and end dates, False otherwise.
    """
    # Convert strings to datetime objects
    start_date = datetime.strptime(start_date_str, "%Y/%m/%d")
    end_date = datetime.strptime(end_date_str, "%Y/%m/%d")
    target_date = datetime.strptime(target_date_str, "%Y/%m/%d")

    # Check if the target date is between the start and end dates
    return start_date <= target_date <= end_date


def get_report_between_days(request, report_start_date, report_end_date):
    """
    Fetches the purchase report for a specific date range.

    Args:
        request: HTTP request object.
        report_start_date (str): Start date for the report.
        report_end_date (str): End date for the report.

    Returns:
        JsonResponse: Response containing the report for the specified date range or bad request.
    """
    if request.method == "GET":
        purchases = JSONHANDLER_INSTANCE.read_content("purchases.json")

        report_start_date = report_start_date.replace("-", "/")
        report_end_date = report_end_date.replace("-", "/")
        

        report_between_dates = {}
        sales_between_dates = 0
        total_quantity_sold = 0
        total_bills = 0
        item_frequency = {}


        for idx, bill_details in purchases.items():
            if is_date_between(report_start_date, report_end_date, bill_details["purchase_date"]):
                date_key = bill_details["purchase_date"]
                if date_key not in report_between_dates:
                    report_between_dates[date_key] = []
                    
                bill_details_with_id = {"id": idx, **bill_details}
                report_between_dates[date_key].append(bill_details_with_id)
                
                total_bills += 1
                sales_between_dates += bill_details.get("totalamountpayable", 0)
                total_quantity_sold += bill_details.get("totalquantity", 0)
                
                #Counting frequency of each item sold
                for drug_id, drug in bill_details.get("meds", {}).items():
                    drug_name = drug.get("drug_name")
                    if drug_name:
                        item_frequency[drug_name] = item_frequency.get(drug_name, 0) + drug.get("quantity", 0)
                        
        # Finding the most frequently bought item
        most_frequent_item = None
        if item_frequency:
            most_frequent_item = max(item_frequency, key=item_frequency.get)

        response_data = {
            "response": "ok",
            "description": f"Reports between {report_start_date} and {report_end_date} fetched",
            "purchases": report_between_dates,
            "grand_total": sales_between_dates,
            "total_quantity": total_quantity_sold,
            "total_bills": total_bills,
            "most_frequent_item": most_frequent_item
        }
        
        return JsonResponse(response_data,status=200)

    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_expiring_drugs(request):
    """
    Fetches drugs with expiration dates within the specified interval.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response containing expiring drugs or bad request.
    """
    if request.method == "GET":
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")
        expiring_drugs = {}

        for drug_id, drug_details in stocks.items():
            expiry_date = "01/" + drug_details["expiry_date"]

            expiry_date = datetime.strptime(expiry_date, "%d/%m/%Y")

            today = datetime.now()

            difference = (expiry_date - today).days

            if MAX_EXPIRY_TIME_INTERVAL >= difference > 0:
                drug_details.update({"days_until_expiry": difference})
                expiring_drugs.update({drug_id: drug_details})

        return JsonResponse(
            {
                "response": "ok",
                "description": "Fetched expiring drugs",
                "drugs": expiring_drugs,
            },
            status=200,
        )

    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_expired_drugs(request):
    """
    Fetches drugs that have expired.

    Args:
        request: HTTP request object.

    Returns:
        JsonResponse: Response containing expired drugs or bad request.
    """
    if request.method == "GET":
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")
        expired_drugs = {}

        for drug_id, drug_details in stocks.items():
            expiry_date = "01/" + drug_details["expiry_date"]

            expiry_date = datetime.strptime(expiry_date, "%d/%m/%Y")

            today = datetime.now()

            difference = (today - expiry_date).days

            if difference >= 0:
                drug_details.update({"days_after_expiry": difference})
                expired_drugs.update({drug_id: drug_details})

        return JsonResponse(
            {
                "response": "ok",
                "description": "Fetched expired drugs",
                "drugs": expired_drugs,
            },
            status=200,
        )

    else:
        return JsonResponse({"response": "bad request"}, status=400)

def get_bill(request, bill_id):
    """
    Fetches details of a specific order by its ID.

    Args:
        request: HTTP request object.
        order_id (str): ID of the order to fetch.

    Returns:
        JsonResponse: Response containing the order details or not found response.
    """
    if request.method == "GET":
        # Read existing bills from the JSON file
        bills = JSONHANDLER_INSTANCE.read_content("purchases.json")

        # Fetch the specific order
        bill = bills.get(bill_id)

        if bill:
            return JsonResponse({"response": "ok", "bill": bill}, status=200)
        else:
            return JsonResponse({"response": "not found", "description": "Bill ID not found"}, status=401)

    else:
        # Return bad request response for non-GET requests
        return JsonResponse({"response": "bad request"}, status=400)



def get_all_users(request):
    """
    Fetches all unique users.

    Returns:
        JsonResponse: Response containing unique users.
    """
    if request.method == "GET":
        users = JSONHANDLER_INSTANCE.read_content("users.json")
        users = list(users.keys())
        return JsonResponse({"users": users}, status=200)
    else:
        return JsonResponse({"response": "bad request"}, status=400)
    
def get_all_customers(request):
    """
    Fetches all unique users from purchases.

    Returns:
        JsonResponse: Response containing unique users from purchases.
    """
    if request.method == "GET":
        purchases = JSONHANDLER_INSTANCE.read_content("purchases.json")
        unique_users = set()

        for purchase in purchases.values():
            user = purchase.get("customer_name")
            if user:
                unique_users.add(user)

        return JsonResponse({"customers": list(unique_users)}, status=200)
    else:
        return JsonResponse({"response": "bad request"}, status=400)


def get_all_providers(request):
    """
    Fetches all unique providers from stocks.

    Returns:
        JsonResponse: Response containing unique providers.
    """
    if request.method == "GET":
        stocks = JSONHANDLER_INSTANCE.read_content("stocks.json")
        providers = list({stock['provider'] for stock in stocks.values()})
        return JsonResponse({"providers": providers}, status=200)
    else:
        return JsonResponse({"response": "bad request"}, status=400)
