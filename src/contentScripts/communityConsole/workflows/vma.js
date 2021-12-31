// We just import the components needed.
import {list, menu} from 'vue-material-adapter';

export default {
  install(vm) {
    vm.use(list);
    vm.use(menu);
  },
}
