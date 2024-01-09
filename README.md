# cloudflare-pages-mta-sts
Simple script to generate a static mta-sts.txt file from your MX records and serve them via Cloudflare Pages.

## Usage
1. Create a new **Cloudflare Pages** application and link this repository
2. As "Framework preset" select "none"
3. As "Build command" enter `node generate.js`
4. Leave "Build output directory" empty
5. Define the following environment variables in the Cloudflare UI

| ENV VAR           | Description                                                                          |
|-------------------|--------------------------------------------------------------------------------------|
| `DOMAIN`          | Target domain                                                                        |
| `MTA_STS_MODE`    | This is the policy mode. Can be `enforce`, `testing` or `none`. (Default: `testing`) |
| `MTA_STS_MAX_AGE` | Indicates how long the sender should cache the policy (Default: `1209600`)           |

6. Click "Save and Deploy"
7. Under "Custom domains" click "Set up a custom domain" and add "mta-sts.[YOUR_DOMAIN]"

## Pages vs Worker

This script DOES NOT run a Cloudflare Worker, it just generates a static mta-sts.txt during deployment and serves it via Cloudflare Pages (or Github Pages), this has the following implications:

- **PRO**: It's cheap, because serving static pages on Cloudflare is always free. (Ideal when you are on the free plan)
- **CON**: It's static, so every time you change your MX records, you need to redeploy the **Cloudflare Pages** application
