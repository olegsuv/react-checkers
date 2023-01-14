# Checkers

Demo: https://olegsuv-react-checkers.netlify.app/

# Tech stack
- React
- Typescript
- HTML/CSS
- classNames lib
- class component

# Description

Classic checkers game on 8x8 field.\
The red team named "A", playable by humans only and starting the game.\
The black team named "B", playable by AI (current config) or by a human.\
To disable AI, change the value: `App.tsx:20` `const brainLessAI = true` into `false`.\

Units are forcing to attack if they can to do this, moves are disabling in this case.`\
Units cannot attack backward (which is possible by some rules).\
Units are not becoming "queen" if they reach the end of root.\
Won message will appear if some team will run out of units.

# For real project implementation:
1. Unit tests
2. Drag-n-drop by https://react-dnd.github.io/react-dnd/about
3. Redux instead of state
4. Splitting App.tsx files into components