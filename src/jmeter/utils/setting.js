export let Setting = {
  // ThreadGroup: {
  //   tree: {
  //     drag: false,
  //     drop: false
  //   },
  //   menu: {
  //     disabled: true
  //   },
  //   edit: {
  //     disabled: true
  //   }
  // }
};

export const use = function (s) {
  Setting = s || Setting;
}

export default {use}
