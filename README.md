# Tailscale Exit Node with AWS CDK and Deno

This repository automates the creation of a Tailscale exit node in your chosen AWS region using the AWS CDK. You will need:

- Deno
- Tailscale Auth Key

To create a Tailscale exit node, run the following commands:

> This script will create a new Tailscale exit node in sa-east-1 to adjust and change the exit node name, change the stacks array in main.ts file.

```bash
deno task bootstrap --profile profile
TAILSCALE_AUTH_KEY=your_key deno task deploy --profile profile
```

To destroy the Tailscale exit node, run the following command:

```bash
deno task destroy --profile profile
```

> Note: Replace **profile** with your AWS profile configured in the AWS credentials file (.aws/credentials).

Thanks to @scottgerring and your blog post: https://blog.scottgerring.com/posts/automating-tailscale-exit-nodes-on-aws/
