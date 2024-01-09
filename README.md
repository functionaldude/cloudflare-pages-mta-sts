# cloudflare-pages-mta-sts
Simple script to generate a static mta-sts.txt file from your MX records and serve them via Cloudflare Pages.

## Usage
1. Create a new *Cloudflare Pages* application and link this repository
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

