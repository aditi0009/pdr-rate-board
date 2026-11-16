# PDR Rate Board

A live community board where photodissociation-region (PDR) modelling groups flag chemical reaction rates that are **missing** from a network, look **wrong**, need a **recheck**, or have a **newer measurement** available, confirm each other's reports, change their status, and discuss networks and benchmarks.

Live page (shared store, login required to write): https://claude.ai/artifact/Vkn2g2gSng7DmRnnVtGek7

## What it holds

- **Reports**: one reaction per entry, in the notation of the network it concerns; issue type; the databases or networks concerned (UDfA12, UDfA22, KIDA 2014/2024, OSU, Cloudy, NL97, NL99, Meudon PDR, UCL_PDR, 3D-PDR, own); the rate as given and a suggested rate in modified Arrhenius form k = α (T/300 K)^β exp(−γ/T); temperature range; reference; priority; species tags; status (open, under review, confirmed, resolved, disputed); confirmations ("I see this too", one per person); a comment thread.
- **Discussion**: posts with tags and replies.
- **Groups**: a registry of groups, codes, networks and contacts.
- **How it works**: definitions of the issue types, statuses and the rate notation.

## How it is built

`index.html` is a single self-contained page: plain HTML, CSS and JavaScript, no build step, two Google fonts (IBM Plex Sans and Mono). Light and dark themes follow the viewer's setting.

The shared, real-time data (reports, comments, votes, posts, groups) lives in the claude.ai artifact runtime's document store, reached through `window.claude.use("db")` and `window.claude.use("user")`. **Opened anywhere else, for example from GitHub Pages or a local file, the page renders but shows the store as unavailable and cannot read or write reports.** To run it outside claude.ai, replace the `db` and `user` namespaces in the boot section at the bottom of the script with another document store that offers `collection().add/onSnapshot/orderBy/limit`, `doc().set/update/delete/onSnapshot` and a viewer id; the rest of the page does not care where the documents come from.

Access rules declared with the page: everyone who can open it reads everything; contributors and above add reports, comments, posts and groups and change statuses; each person's confirmations are written only by that person (`votes/{self}`), and only the owner can tidy them.

## Files

- `index.html`: the page
- `README.md`: this file
