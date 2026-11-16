# PDR Rate Board

A live community board where photodissociation-region (PDR) modelling groups flag chemical reaction rates that are **missing** from a network, look **wrong**, need a **recheck**, or have a **newer measurement** available, confirm each other's reports, change their status, and discuss networks and benchmarks.

Live page (shared store, login required to write): https://claude.ai/artifact/Vkn2g2gSng7DmRnnVtGek7

## What it holds

- **Reports**: one reaction per entry, in the notation of the network it concerns; issue type; the databases or networks concerned (UDfA12, UDfA22, KIDA 2014/2024, OSU, Cloudy, NL97, NL99, Meudon PDR, UCL_PDR, 3D-PDR, own); the rate as given and a suggested rate in modified Arrhenius form k = α (T/300 K)^β exp(−γ/T); temperature range; reference; priority; species tags; status (open, under review, confirmed, resolved, disputed); confirmations ("I see this too", one per person); a comment thread.
- **Discussion**: posts with tags and replies.
- **Groups**: a registry of groups, codes, networks and contacts.
- **How it works**: definitions of the issue types, statuses and the rate notation.

## Choosing a code

Two tabs help modellers pick between **Meudon PDR, 3D-PDR, Cloudy and UCLCHEM**:

- **Choose a code**: guided questions (what the object is, 1D or 3D, steady state or time evolution, what you compare with, whether the code should compute the gas temperature, extras such as H₂ lines or cosmic-ray attenuation). The four codes are ranked live against the requirements those answers imply, and every reason opens to the quoted passage it rests on.
- **Codes**: a capability matrix, then one section per code (version, licence, requirements, network, links to the official pages and repositories) and the full source list.

The rule behind both: **no claim without a source**. The knowledge base is the JSON block `#pdr-kb` in `index.html`. Each capability is `{cap, v: yes|partial|no, t: text, s: source id, q: verbatim quote}`, drawn only from arXiv papers, the codes' official documentation and their public repositories at pinned commits (retrieved 16 November 2026). A capability that the sources do not mention is left out and shown as "not documented"; it scores 0, while "no" (−4) is used only where a source says so. Scoring per requirement: yes 2, partly 1.

To add a code or a capability: add the source to `sources`, add claims with the exact quoted passage, and run `node advisor.test.mjs` (knowledge-base integrity plus golden questions such as "H II region + spectrum → Cloudy").

## How it is built

`index.html` is a single self-contained page: plain HTML, CSS and JavaScript, no build step, two Google fonts (IBM Plex Sans and Mono). Light and dark themes follow the viewer's setting.

The shared, real-time data (reports, comments, votes, posts, groups) lives in the claude.ai artifact runtime's document store, reached through `window.claude.use("db")` and `window.claude.use("user")`. **Opened anywhere else, for example from GitHub Pages or a local file, the page renders but shows the store as unavailable and cannot read or write reports.** To run it outside claude.ai, replace the `db` and `user` namespaces in the boot section at the bottom of the script with another document store that offers `collection().add/onSnapshot/orderBy/limit`, `doc().set/update/delete/onSnapshot` and a viewer id; the rest of the page does not care where the documents come from.

Access rules declared with the page: everyone who can open it reads everything; contributors and above add reports, comments, posts and groups and change statuses; each person's confirmations are written only by that person (`votes/{self}`), and only the owner can tidy them.

## Files

- `index.html`: the page, including the code knowledge base (`#pdr-kb`)
- `advisor.test.mjs`: checks for the knowledge base and the ranking (`node advisor.test.mjs`)
- `README.md`: this file
