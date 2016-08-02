'use babel';

import ScrollHistory from '../lib/scroll-history';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('ScrollHistory', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('scroll-history');
  });

  describe('when the scroll-history:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.scroll-history')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'scroll-history:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.scroll-history')).toExist();

        let scrollHistoryElement = workspaceElement.querySelector('.scroll-history');
        expect(scrollHistoryElement).toExist();

        let scrollHistoryPanel = atom.workspace.panelForItem(scrollHistoryElement);
        expect(scrollHistoryPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'scroll-history:toggle');
        expect(scrollHistoryPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.scroll-history')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'scroll-history:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let scrollHistoryElement = workspaceElement.querySelector('.scroll-history');
        expect(scrollHistoryElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'scroll-history:toggle');
        expect(scrollHistoryElement).not.toBeVisible();
      });
    });
  });
});
