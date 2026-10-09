# Gentle Beginnings Rentals

Project: Baby Carrier Rental Catalogue Website (India)

Build a premium boutique-style catalogue website for a home-run baby carrier rental service based in India.
This is a catalogue + availability + enquiry platform, NOT automated payments.

Core Goals

Showcase baby carriers available for rent

Display real-time availability with return dates

Allow customers to request bookings (manual approval)

Enable WhatsApp-based enquiry & conversion

Include rental agreement acceptance

Provide an admin dashboard for inventory & booking management

TECH STACK (RECOMMENDED)

Frontend: React + Tailwind (premium, soft boutique UI)

Backend: Supabase or Firebase

Database-driven availability calendar

Admin authentication (email + password)

Mobile-first design

WEBSITE STRUCTURE
1️⃣ Homepage

Brand intro: “Baby Carrier Rental & Sling Library”

Short explanation: Try before you buy, weekly/monthly rentals

Embedded Instagram feed

Categories grid:

Ring Slings

Wraps

Buckle Carriers

Onbuhimo

Floating or product-level “Enquire on WhatsApp” buttons

2️⃣ Category Pages

Each category lists multiple carriers with:

Product image (2 images per carrier)

Brand + model name

Short description

Weekly rent

Monthly rent

Availability badge:

Available

Rented till [DATE]

Filters:

Age range

Category

Availability

3️⃣ Product Detail Page (Very Important)

Each carrier must display:

Product Info

Brand name

Model name

Category

Suitable baby age (months)

Weight range

Condition (gently / very gently used)

Recommended carry positions

Pricing

Weekly rent

Monthly rent (discounted)

Refundable security deposit

Buyout price (same as deposit)

Availability Calendar

Date-based calendar

Overlapping bookings blocked

If rented, clearly show:

“Currently rented. Available after: DD/MM/YYYY”

Actions

“Request Booking” button

“Enquire on WhatsApp” (pre-filled message with product name)

4️⃣ Booking Request Flow (No Payments)

When user clicks Request Booking:

Collect:

Name

Phone number

City

Preferred rental start date

Duration (weekly / monthly)

Show rental agreement summary

Require checkbox:
☐ I agree to the rental terms & conditions

Submit request → stored in admin dashboard

Confirmation message:

“Thank you! We’ll confirm availability on WhatsApp.”

5️⃣ Rental Agreement & Policies (Auto-generated Pages)

Create dedicated pages using the extracted PDF content:

📄 Rental Policy & Terms

Include:

Refundable deposit rules

Rental period & late fees (₹100/day)

Return expectations

Shipping responsibility

Damage, loss & non-return policy

Cleaning & laundry charges

Safety responsibility disclaimer

🍼 Babywearing Safety & Tips

Include:

Getting started tips

T.I.C.K.S. checklist

M-shape positioning

Comfort & safety guidance

Encouragement to reach out for fit checks

6️⃣ Buyout Explanation (No Direct Purchase)

On every product page:

“Buyout available. If you decide to keep the carrier, the refundable deposit will be adjusted against the purchase price. Please contact us on WhatsApp to proceed.”

ADMIN DASHBOARD (SECURE LOGIN)

Admin must be able to:

Add / edit / delete carriers

Upload product images

Assign category

Set weekly/monthly rent & deposit

Manage availability dates

Mark carrier as:

Available

Rented (with return date)

View booking requests

Mark returned items

DATABASE MODELS
Carrier

id

brand_name

model_name

category

age_range

weight_range

weekly_rent

monthly_rent

refundable_deposit

buyout_price

laundry_instructions

description

images[]

availability_status

next_available_date

BookingRequest

id

carrier_id

customer_name

phone

city

start_date

duration

status (pending / approved / completed)

DESIGN REQUIREMENTS

Premium boutique look

Soft neutral colors

Clean typography

High trust & warmth

Mobile-first

Easy for non-technical admin

INTEGRATIONS

WhatsApp deep links with pre-filled messages

Instagram embedded feed on homepage

FUTURE-READY (DO NOT IMPLEMENT NOW)

Online payments

Customer login

Inventory analytics

Final Instruction

Generate the entire working application, including:

UI

Backend

Database schema

Admin dashboard

Pre-filled policy pages

Sample demo data for 2–3 carriers

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nestledbabywearing.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d24cc3e7-0415-44b6-8994-ae775ab1ba1d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
