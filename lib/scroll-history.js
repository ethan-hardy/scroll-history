'use babel';

const STEP_DIRECTIONS = {
  FORWARD: 'FORWARD',
  BACK: 'BACK'
};

const scrollPositionHistoriesMap = {}; //maps file paths to history objects

const createMappingIfNeeded = function(textEditor) {
  const path = textEditor.getPath();
  if (!scrollPositionHistoriesMap[path]) {
    scrollPositionHistoriesMap[path] = {positions: [], currentSpot: 0};
  }
  return scrollPositionHistoriesMap[path];
};

const getActiveTextEditor = function() {
  return atom.workspace.activeTextEditor;
};

const getCurrentLine = function() {
  //TODO
};

const moveToLine = function(line) {
  //TODO
};

const stepInDirection = function(direction) {
  const activeTextEditor = getActiveTextEditor();
  const currentHistory = createMappingIfNeeded(activeTextEditor);
  if (direction === STEP_DIRECTIONS.BACK && currentHistory.currentSpot === 0 ||
      direction === STEP_DIRECTIONS.FORWARD && currentHistory.currentSpot >= currentHistory.positions.length) {
    return;
  }

  if (direction === STEP_DIRECTIONS.BACK) { currentHistory.currentSpot--; }
  else { currentHistory.currentSpot++; }
  moveToLine(currentHistory.positions[currentHistory.currentSpot]);
};

export default {
  addPosition() { //TODO: bind this to cursor click
    const activeTextEditor = getActiveTextEditor();
    const currentHistory = createMappingIfNeeded(activeTextEditor);
    const currentLine = getCurrentLine();

    currentHistory.positions.push(currentLine);
    //we want to reset the tracking of the currentSpot when the user clicks somewhere
    currentHistory.currentSpot = currentHistory.positions.length - 1;
  },

  stepForward() {
    stepInDirection(STEP_DIRECTIONS.FORWARD);
  },

  stepBack() {
    stepInDirection(STEP_DIRECTIONS.BACK);
  }
};
