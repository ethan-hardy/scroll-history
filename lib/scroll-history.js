'use babel';

import ScrollHistoryView from './scroll-history-view';
import { CompositeDisposable } from 'atom';

export default {
  scrollHistoryView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.scrollHistoryView = new ScrollHistoryView(state.scrollHistoryViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.scrollHistoryView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'scroll-history:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.scrollHistoryView.destroy();
  },

  serialize() {
    return {
      scrollHistoryViewState: this.scrollHistoryView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }
};
