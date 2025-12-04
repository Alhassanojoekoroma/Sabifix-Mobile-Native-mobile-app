Document 1: Full PRD (Product Requirements Document)
Product Name: SabiFix

A Civic Infrastructure Reporting & Community Prioritization App for Sierra Leone

1. Executive Summary

SabiFix is a mobile and web platform that enables citizens to report community issues such as potholes, broken pipes, garbage problems, and malfunctioning street lights. Other citizens can upvote these issues to help local councils identify which problems the community prioritizes most.

The system includes:

Citizen App

Council Officer Dashboard

Priority Ranking System

Issue Status Tracking

Notifications & Updates

The purpose is to create a structured, transparent, and data-driven way for governing bodies to focus on the most urgent issues based on collective citizen input.

2. Problem Statement

Citizens currently lack a structured channel for reporting civic problems. Complaints are often lost on radio shows, WhatsApp groups, or Facebook posts, resulting in:

No transparency

No prioritization

No accountability

Local councils need a system that clearly shows what the community cares about most.

3. Goals
Citizen Goals:

Quickly report problems

Upvote issues that affect daily life

Track status of issues they created or upvoted

Receive feedback and updates

Council Goals:

See top-priority issues

Track problem distribution by community

Mark issues as “In Progress” or “Resolved”

Improve efficiency and trust

4. Core Features (MVP)
Citizen App Features
1. Report Community Issue

Upload/take photo

Select problem category

Add short description

Pin location using GPS or manual map pin

Submit and publish

2. Upvote an Issue

One upvote per user per issue

Issues reorder based on total votes

3. Issue Map & List Views

Map shows issues near the user

List ranks issues by community prioritization

4. Issue Detail Page

Show full description

Show upvotes

Show timeline (Reported → In Progress → Resolved)

Allow upvoting

Allow sharing

5. Notifications

Issue status updated

Council feedback added

Popular issues in user’s area

Council Dashboard Features
1. Log In / Role-Based Access

Admin

Supervisor

Field Officer

2. Prioritization Dashboard

Ranked issues

Filters (category, community, date, status)

3. Issue Status Updates

Mark as “Reported” → “In Progress” → “Resolved”

Add notes

Upload proof-of-fix photos

4. Analytics Widgets

Total Issues

Resolved

In Progress

Resolution Rate

Community distribution pie chart (future version)

5. Out of Scope (v1)

AI-based issue classification

Mobile money rewards

Gamification

Offline Mode

Multi-language

Contractor assignments

Voice reporting

Comment threads

6. Technical Requirements
Target Platforms:

Mobile App: Built using Google Antigravity for Windows

Web App: React / Next.js

Backend: Firebase or Supabase

Key System Components:

Authentication

Firestore Database / Supabase DB

Storage (Photos)

Real-time listeners

Notification system

Admin Console

7. Data Model
User

userId

name

email/phone

role (citizen, council, admin)

createdAt

Issue

issueId

title

description

category

imageUrl

location {lat, lng}

status (Reported, In Progress, Resolved)

upvoteCount

reporterId

createdAt

Upvotes

issueId

userId

Notifications

userId

issueId

message

timestamp

8. Success Metrics

Number of issues reported

Number of upvotes

Monthly active users

Resolution rate %

Avg time from Report → In Progress

Avg time from In Progress → Resolved

9. Release Phases
Phase 1 — Authentication + Reporting
Phase 2 — Upvotes + Map + Council Dashboard
Phase 3 — Notifications + Admin Controls
Phase 4 — Analytics + Optimization
Phase 5 — Launch + Monitoring + Maintenance
End of PRD
Document 2: Full Design Style Guide (Brand & UI System)
Prepared for Mobile Development with Google Antigravity
1. Brand Identity
Brand Name: SabiFix

Meaning: “See problem → Fix problem.”

Brand Personality:

Trustworthy

Community-first

Modern and simple

Government-friendly

2. Color Palette
Primary Colors:
Purpose	Color	Hex
Brand Blue	Deep Blue	#312EFF
Highlight Yellow	Light Yellow	#FFFA8E
Accent Orange	Orange	#FFB229
Secondary Colors:
Purpose	Color	Hex
Light Blue	#9796FF	
Light Gray Background	#F4F7F9	
Dark Text	#2E2E2E	
Success Green	#00B894	
Warning Orange	#FFB229	
3. Typography
Primary Font:

Inter (Google Antigravity Compatible)
Weights: Regular, Medium, Semi-bold, Bold

Font Styles:

Titles: Inter Bold (20–28px)

Subtitles: Inter Semi-bold (16–18px)

Body Text: Inter Regular (13–15px)

Captions: 12px

4. UI Components
Buttons

Primary Button:

Background: #312EFF

Text: White

Shape: Fully rounded (pill button)

Secondary Button:

Background: White

Border: 1.5px #312EFF

Text: #312EFF

Rounded (16px)

Danger Button:

Filled orange #FFB229

5. Card Style

Issue Cards:

White background

Rounded (20px)

Shadow: soft (0 5px 15px rgba(0,0,0,0.08))

Title: Bold

Subtext: Gray (#6B7280)

6. Map Marker Style
High-priority marker:

Color: #FFB229

Shape: circular

Icon: exclamation

7. Motion & Interaction

Button tap: bounce 3–5%

Modal slides up from bottom

Screen navigation: left-right slide

Status change: fade-in opacity

8. Layout System
Grid:

8px spacing system

Safe zones for mobile notches

Header height: 60px

Footer height: 55px

Page Structure:

Header

Scrollable content

Floating action button

Bottom nav (if needed)

9. Iconography

Use:

Feather Icons

Material Symbols Rounded

10. Design for Google Antigravity

Components must be:

Clean

Declarative

Short text

Simple layout hierarchy (Container → Section → Rows)

Stress responsive blocks

End of Style Guide
Document 3: User Journey Maps
1. Persona 1: Mariatu (Market Woman)
Journey: Report a Problem

Opens app

Clicks “Report Issue”

Takes photo

Selects “Roads / Pothole”

Writes short description

Auto-pins GPS

Submits

Sees issue appear on map

Receives notifications

Pain Points:

Poor internet

Unclear if council sees it

Opportunities:

Offline draft reports

Simple flow with big buttons

2. Persona 2: Abdul (Student)
Journey: Upvote & Track Issue

Opens app

Sees map or list

Clicks “Large Pothole at Hill Station”

Upvotes

Receives status updates

Shares issue with friends

Sees issue move up in ranking list

3. Persona 3: Council Supervisor
Journey: Resolve & Update Issue

Logs in

Opens dashboard

Sees top issues

Filters by “Wellington”

Assigns issue to field officers

Marks status as “In Progress”

Adds note

Field officer uploads “Resolved” photo

System notifies citizens

4. New User Journey

Lands on Welcome Screen

Select:
→ “Citizen”
→ or “Council Officer”

Logs in with phone number or email

Directed to Map or Dashboard

5. Notification Journey

Triggers include:

Issue gets accepted

Status moves to In Progress

Status moves to Resolved

New high-priority issue near user

6. Error Handling Journey

If image upload fails → Retry button

If GPS fails → Manually select location

If upvote already used → Show modal: “You've already upvoted”

End of User Journeys Document