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

const moveToLine = function(line) { //eslint-disable-line no-unused-vars
  //TODO
};

const stepInDirection = function(direction) {
  const activeTextEditor = getActiveTextEditor();
  const currentHistory = createMappingIfNeeded(activeTextEditor);
  const atEndOfRecords = direction === STEP_DIRECTIONS.BACK ?
    currentHistory.currentSpot === 0 : currentHistory.currentSpot >= currentHistory.positions.length;
  if (atEndOfRecords) { return; }

  currentHistory.currentSpot = direction === STEP_DIRECTIONS.BACK ?
    currentHistory.currentSpot - 1 : currentHistory.currentSpot + 1;
  moveToLine(currentHistory.positions[currentHistory.currentSpot]);
};

const updateHistoryPathForEditor = function(editor, oldPath) {
  const newPath = editor.getPath();
  scrollPositionHistoriesMap[newPath] = scrollPositionHistoriesMap[oldPath];
  Reflect.deleteProperty(scrollPositionHistoriesMap, oldPath);
};

export default {
  activate() {
    atom.commands.add('atom-text-editor', 'scroll-history:step-forward', this.stepForward);
    atom.commands.add('atom-text-editor', 'scroll-history:step-back', this.stepBack);

    this.currentActiveEditor = null;
    this.updateActiveEditorSubscription();

    //TODO: should maybe use ::onDidStopChangingActivePaneItem(callback) instead?
    this.activePaneItemChangedDisposable
      = atom.workspace.onDidChangeActivePaneItem(this.updateActiveEditorSubscription);
  },

  deactivate() {
    this.unsubscribeFromCurrentEditor();
  },

  addPosition() {
    const activeTextEditor = getActiveTextEditor();
    const currentHistory = createMappingIfNeeded(activeTextEditor);
    const currentLine = getCurrentLine();

    //TODO: do nothing if the click is on a line close enough to the last record
    //for an acceptable range to be outside of, we can use half the height, in lines, of the editor

    currentHistory.positions.push(currentLine);
    //we want to reset the tracking of the currentSpot when the user clicks somewhere (TODO: do we actually?)
    currentHistory.currentSpot = currentHistory.positions.length - 1;
  },

  updateActiveEditorSubscription() {
    this.unsubscribeFromCurrentEditor();

    const activeTextEditor = getActiveTextEditor();
    if (!activeTextEditor) { return; }

    const oldPath = activeTextEditor.getPath();
    this.pathChangedDisposable = activeTextEditor.onDidChangePath(() => {
      updateHistoryPathForEditor(activeTextEditor, oldPath);
    });
    this.currentActiveEditor = activeTextEditor;

    const editorView = activeTextEditor.getView();
    editorView.addEventListener('mouseup', this.addPosition);
  },

  unsubscribeFromCurrentEditor() {
    if (!this.currentActiveEditor) { return; }
    this.pathChangedDisposable.dispose();

    const editorView = this.currentActiveEditor.getView();
    editorView.removeEventListener('mouseup', this.addPosition);
    this.currentActiveEditor = null;
  },

  stepForward() {
    if (!this.currentActiveEditor) { return; }
    stepInDirection(STEP_DIRECTIONS.FORWARD);
  },

  stepBack() {
    if (!this.currentActiveEditor) { return; }
    stepInDirection(STEP_DIRECTIONS.BACK);
  }
};
