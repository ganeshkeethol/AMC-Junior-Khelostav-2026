# AMC Junior Khelostav 2026 — Detailed Website

Community event website for Ambience Courtyard.

## Sections
- Sports & Fun Games
- Sports Volunteers
- Kids Enrollments
- Event Schedule
- General Guidelines
- Sport-specific Rules & Regulations
- Live Results
- Google Form registration

## Current event list
Badminton, Box Cricket, Basketball, Carroms, Chess, Swimming, Table Tennis, Drawing, Musical Chairs, Quiz, Slow Cycle.

## Add Google Form later
Edit `config.js`:
`googleFormUrl:"YOUR_GOOGLE_FORM_LINK"`

## Live Google Sheet structure
Create tabs named:
- Schedule
- Results
- Volunteers
- Enrollments

Suggested columns:

Schedule:
`day | reporting | time | event | ageGroup | venue | status`

Results:
`event | ageGroup | position | child | score | medal`

Volunteers:
`sport | role | name | contact | reporting`

Enrollments:
`child | ageGroup | event | enrollmentStatus | eventStatus`

For children's privacy, do not expose phone numbers, apartment numbers, medical details or other private information on a public website. The public API should expose only approved fields.

## GitHub Pages
Upload the files to a GitHub repository, then Settings → Pages → Deploy from branch → main → root.

### Branding & Coming Soon Media
The website includes the supplied AMC Junior Khelostav event logo, Ambience Courtyard logo, and Coming Soon video in the `assets/` folder. These files are referenced locally so they will work on GitHub Pages after the full folder is uploaded.
