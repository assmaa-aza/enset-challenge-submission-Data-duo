#google drive with all what you need to know about the solution : https://drive.google.com/drive/folders/1X9MgghlyF74YU1z5GMikZiSxXT7K9PyM?usp=drive_link
# enset-challenge-submission-Data-duo

# ProcrastiNO 🤖
 
> A smart productivity tool that helps students overcome procrastination, stay focused, and get their work done efficiently.
 
## 📁 Structure
 
```
procrastino/
├── index.html          ← Application principale
└── agents/
    ├── behavior.js     ← Behavior Analyzer (onboarding + analyse en session)
    ├── planner.js      ← Focus Planner (gestion des cycles)
    ├── motivation.js   ← Motivation Agent (messages d'encouragement)
    └── control.js      ← Control Agent (blocage des distractions)
```
 
## 🚀 Lancer le projet
 
### Option 1 — Python (recommandé)
 
```bash
cd chemin/vers/procrastino
python -m http.server 3000
```
 
Puis ouvre **http://localhost:3000** dans ton navigateur.
 
> Si le port 3000 est bloqué, essaie 9000, 4000, ou 8000.

 
## 🤖 Comment ça marche
 
Au lancement, le **Behavior Analyzer** te pose 4 questions pour personnaliser ton plan :
 
1. Combien de temps tu as en tout ?
2. Combien de temps tu veux travailler ?
3. Quel type de travail ?
4. Ton niveau d'énergie ?
 
Une fois le plan confirmé, le **Focus Planner** démarre des cycles focus/pause adaptés à tes réponses.
 
## 🛠 Tech
 
- HTML / CSS / JavaScript pur — aucune dépendance
- Architecture multi-agents (ReAct pattern)
- Aucun build, aucun npm install
 
