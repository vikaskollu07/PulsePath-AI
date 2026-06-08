# PulsePath AI

PulsePath AI is a recruiter-facing healthcare analytics project: an interactive clinical risk command center for prioritizing patient outreach, explaining risk drivers, and turning synthetic patient signals into care-team actions.

## Why it stands out

- Healthcare-specific product thinking, not a generic dashboard.
- Synthetic patient data, so the project is privacy-safe and contains no PHI.
- Explainable AI framing with feature contribution, confidence, governance, and human-in-the-loop decision support.
- Interactive filtering, risk scoring, patient triage, trend visualization, and intervention planning.
- Runs locally with no install step, making it easy to demo in interviews.

## How to run

Open `index.html` in a browser.

## How to deploy

### Option 1: GitHub Pages

1. Create a new GitHub repository named `pulsepath-ai`.
2. Push this project to that repository.
3. In GitHub, open the repository settings.
4. Go to **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/root` folder.
7. Save. GitHub will publish the site and give you a live URL.

### Option 2: Netlify

1. Go to Netlify and choose **Add new site**.
2. Import the GitHub repository.
3. Leave the build command blank.
4. Set the publish directory to `/`.
5. Deploy.

### Option 3: Vercel

1. Import the GitHub repository in Vercel.
2. Keep the framework preset as **Other**.
3. Leave the build command blank.
4. Deploy from the repository root.

## Real-time behavior

The current version includes a live-feed simulation. Cohort metrics, patient risk scores, trend lines, and the live timestamp update automatically every few seconds. This gives the demo a realistic command-center feel while keeping the app privacy-safe and simple to deploy.

To make it production-real-time later, connect the dashboard to a backend such as Supabase, Firebase, or a Node/Express API with WebSockets. The safest portfolio upgrade path is:

- Store synthetic patients and care events in a database.
- Stream new care events into the dashboard.
- Recalculate risk scores when events arrive.
- Keep all data synthetic so the project never touches real patient information.

## What recruiters should notice

- Product sense: the interface is built around real healthcare workflows like care gaps, readmission risk, medication access, and specialist follow-up.
- Frontend craft: responsive layout, polished visual hierarchy, interactive state, generated visual asset, and accessible semantic structure.
- Data storytelling: risk scores are paired with explanations and actions instead of being presented as black-box numbers.
- Responsible AI awareness: the app explicitly avoids PHI and frames the model as decision support, not autonomous diagnosis.

## Suggested resume bullet

Built PulsePath AI, a privacy-safe healthcare analytics dashboard that simulates patient risk stratification, explainable intervention recommendations, cohort trend monitoring, and care-gap prioritization using HTML, CSS, JavaScript, and synthetic data.
