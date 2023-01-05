# Demo task for Tesla, Nov 2020

# Checkers

Tech stack:
- React
- Typescript
- HTML/CSS
- classNames lib
- class component

Classic checkers game on 8x8 field.\
The red team named "A", playable by humans only and starting the game.\
The black team named "B", playable by AI (current config) or by a human.\
To disable AI, change the value: `App.tsx:20` `const brainLessAI = true` into `false`.\

Units are forcing to attack if they can to do this, moves are disabling in this case.`\
Units cannot attack backward (which is possible by some rules).\
Units are not becoming "queen" if they reach the end of root.\
Won message will appear if some team will run out of units.

## For real project implementation:
1. Unit tests
2. Drag-n-drop by https://react-dnd.github.io/react-dnd/about
3. Redux instead of state
4. Splitting App.tsx files into components

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
