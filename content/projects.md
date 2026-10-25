---
title: "Projects"
description: "Real infrastructure I've designed, deployed and supported."
date: 2025-07-09
menu:
  header:
    name: "projects"
    weight: 2
---

## Resorts World Hudson Valley: greenfield IT build-out
<p class="meta-line">2022 – 2026 · Sole Systems Administrator at launch · Newburgh, NY</p>

Opened a new casino destination as the **sole systems administrator and only salaried IT staff member**.

- Planned, installed and configured the **entire IT infrastructure**: 60+ virtual machines, networking and core utilities.
- Ran the IT department and handled technology requests from every other department.
- Deployed hybrid identity from scratch: on-prem Active Directory into Entra ID, with Okta and Duo MFA.
- Directed two IT technicians through hardware staging and network rollout for the launch.
- Responded to security incidents, including containing a ransomware attack.
- Recovered servers and front-line PCs within hours of the CrowdStrike blue-screen outage.
- Joined weekly operations meetings on profit, budget and future expansion.

**Stack:** VMware vSphere · Windows Server · Active Directory · Entra ID · Cisco · Meraki · Veeam · CrowdStrike · Okta · Duo · SQL

## Promotional data reporting & redemption rebuild
<p class="meta-line">2026 – present · Marketing Analyst I · Resorts World Catskills</p>

- Built recurring SQL, Excel and Power Query reports for monthly promotional performance.
- Validated multi-property promotional datasets against backend database logs for financial accuracy.
- Rebuilt the manual prize redemption process to pull directly from the database, removing a fragile screen-scraping step.

**Stack:** SQL Server · T-SQL · Excel · Power Query

## Automated data validation
<p class="meta-line">2022 – 2026 · Systems Administrator · Resorts World</p>

- Ran PowerShell checks on Task Scheduler that track file transfers, row counts and data freshness.
- Used local AI tooling to write and maintain the scripts, with strict safety limits on what they can change.

**Stack:** PowerShell · Task Scheduler · SQL Server

## Wurtsboro Diner & Cafe: network modernization
<p class="meta-line">Jul 2025 · IT Consultant · Wurtsboro, NY</p>

- Replaced the client's outdated Arris hardware with a modern **Ubiquiti mesh** network.
- Upgraded PCs and cabling for faster, more consistent performance.
- Kept on as the main consultant for future upgrades.

**Stack:** Ubiquiti mesh Wi-Fi · structured cabling · Windows

## Homelab: hybrid self-hosting
<p class="meta-line">Ongoing · Personal</p>

- **Protectli Vault FW4B** running pfSense at the edge, with an **Intel NUC 9 Extreme** (i9, 64 GB) running VMware vCenter 7.
- **Venus**, a Ryzen 9 5900X and RTX 3090 (24 GB) box for running AI models locally.
- **Synology NAS** with about 12 TB of raw storage for backups and files.
- A **WireGuard** tunnel to a **RackNerd VPS**, where Caddy reverse-proxies public sites such as memzi.net.
- Game servers on an Ubuntu VM, managed with **CubeCoders AMP**, with dedicated backup storage.
- This website: Hugo, version-controlled on GitHub, with separate dev and prod repos.

**Stack:** pfSense · vCenter 7 · Synology · WireGuard · Caddy · Ubuntu · Docker · Hugo · Git
