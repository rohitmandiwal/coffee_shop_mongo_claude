# claude.md - To-List Application

## Project Overview
**Name**: Coffee Shop
**Purpose**: Small Coffee Shop Management
**Tech Stack**: Node.JS (Backend), Next JS (Frontend), Mongo (Database)  

---

## Key Paths

### Documentation
- Requirements: `.claude/docs/OVERALL_REQUIREMENTS.md`
- Architecture: `.claude/architecture/architecture.md`
- Milestone 1 : `.claude/docs/Milestone1.md`
- Milestone 2 : `.claude/docs/Milestone2.md`
- Milestone 3 : `.claude/docs/Milestone3.md`
- project folder structure : `.claude/architecture/folder_structure.txt`

### Source Code
- Backend: `./backend/src/`
- Frontend: `./frontend/src/`

## Team & Agents

### Planning & Architecture
- **Tech Architect, Developer, DBA, Docker**: `.claude/agents/developer-agent.md`

## Available Skills

- **Developer Skill**: `.claude/skills/developer/SKILL.md`


---

## Technology Decisions

| Tech | Why |
|------|-----|
| Node.JS | Fast dev, async-first, JS expertise |
| Nextjs | Component-based, large ecosystem |
| Mongo | experimental basis |
| JWT | Stateless auth, scales horizontally |

---

## Important Notes

- **Performance Target**: API response < 200ms
- **Scale**: Support 100 concurrent users initially
- **Security**: All endpoints protected, JWT required
- **Phase 1 Focus**: Auth, Lists, Tasks (3 weeks)
- Create new DB tables and no migration needed

## Important & Critical Instructions

- create Docket image and I will deploy manually on docker
- Never run any command. give me and I will run manually to save the tokens
- if needed, always refer "project folder structure" defined above with path instead of scanning all files.
- On Every prompt, always see to use right agent, sub agent and skill and show the name of agent an skills you are using. If you have any doubt about skill and agents and aub agents, ask me.
- Always plan first and then ask me for my approval for every implementation
- Always dry run the implemention code to ensure it runs flawlessly
- If any comman needs to be run, say , "Rohit, Please run command [Command to run]"
- You being DBA, whenever you feel the Mongo is not suitable, tell me in RED
- DB data should be stored in persistant volume
---

---

**Last Updated**: January 16, 2026  
**Project Root**: `/Users/rohitmandiwal/WorkSpace/Playground/claude/mongo_app/`
