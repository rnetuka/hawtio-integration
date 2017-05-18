/// <reference path="../includes.ts"/>
/// <reference path="contexts.service.ts"/>
/// <reference path="context.ts"/>

namespace Camel {

  export class ContextActionsController {

    context: Context;

    constructor($rootScope, private $uibModal, private $timeout, private workspace: Jmx.Workspace,
        private contextsService: ContextsService) {
      'ngInject';
      $rootScope.$on('jmxTreeClicked', (event, selectedNode) => {
        if (this.workspace.isCamelContext()) {
          this.contextsService.getContext(selectedNode.objectName)
            .then(context => this.context = context);
        } else {
          this.context = null;
        }
      });
    }

    isVisible() {
      return this.context !== null;
    }

    start() {
      this.contextsService.startContext(this.context)
        .then(response => {
          this.contextsService.getContext(this.context.mbean)
            .then(context => this.context = context);
        });
    }

    suspend() {
      this.contextsService.suspendContext(this.context)
        .then(response => {
          this.contextsService.getContext(this.context.mbean)
            .then(context => this.context = context);
        });
    }

    delete() {
      this.$uibModal.open({
        templateUrl: 'plugins/camel/html/deleteContextWarningModal.html'
      })
      .result
        .then(() => {
          this.contextsService.stopContext(this.context)
            .then(response => {
              this.context = null;
              this.workspace.removeAndSelectParentNode();
            });
        });
    }

  }

  export const contextActionsComponent = {
    template: `
      <div class="dropdown camel-main-actions" ng-show="$ctrl.isVisible()">
        <button type="button" id="dropdownMenu1" class="btn btn-default dropdown-toggle"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {{$ctrl.context.state}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li ng-class="{disabled: $ctrl.context.state === 'Started'}">
            <a href="#" ng-click="$ctrl.start()">Start</a>
          </li>
          <li ng-class="{disabled: $ctrl.context.state === 'Suspended'}">
            <a href="#" ng-click="$ctrl.suspend()">Suspend</a>
          </li>
          <li>
            <a href="#" ng-click="$ctrl.delete()">Delete</a>
          </li>
        </ul>
      </div>
    `,
    controller: ContextActionsController
  };

}
