import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()


def send_email(to, subject, content):
    user=os.getenv("EMAIL_ID")
    key=os.getenv("EMAIL_PASSWORD")

    msg = EmailMessage()

    msg["Subject"] = subject

    msg["From"] = user

    msg["To"] = to

    msg.set_content(content)

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(user, key)
    server.send_message(msg)
    server.quit()
