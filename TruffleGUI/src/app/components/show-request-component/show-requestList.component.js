import template from './goatsList.html';
import controller from './goatsList.controller';
import './goatsList.scss';

const goatsListComponent = {
  restrict: 'E',
  bindings: {
    goats: '<'
  },
  template,
  controller,
  controllerAs: 'vm'
};

export default goatsListComponent;  
