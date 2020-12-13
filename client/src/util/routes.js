import Main from '@/components/pages/Main.vue'
import Mount from '@/components/pages/Mount.vue'
import Capture from '@/components/pages/Capture.vue'
import Align from '@/components/pages/Align.vue'
import Guide from '@/components/pages/Guide.vue'
import Focus from '@/components/pages/Focus.vue'
import Logs from '@/components/pages/Logs.vue'
import LiveStack from '@/components/pages/LiveStack.vue'
//import ControlPanel from '@/components/pages/ControlPanel.vue'

import IconifyIcon from "@iconify/vue";
import telescope from "@iconify/icons-mdi/telescope";
import target from "@iconify/icons-mdi/target";
import home from "@iconify/icons-mdi/home";
import camera from "@iconify/icons-mdi/camera";
import compass from "@iconify/icons-mdi/compass";
import magnify from "@iconify/icons-mdi/magnify";
import comment from "@iconify/icons-mdi/comment";
import cloud from "@iconify/icons-mdi/cloud";
import cogs from "@iconify/icons-mdi/cogs";

IconifyIcon.addIcon("telescope", telescope);
IconifyIcon.addIcon("target", target);
IconifyIcon.addIcon("home", home);
IconifyIcon.addIcon("camera", camera);
IconifyIcon.addIcon("compass", compass);
IconifyIcon.addIcon("magnify", magnify);
IconifyIcon.addIcon("comment", comment);
IconifyIcon.addIcon("cloud", cloud);
IconifyIcon.addIcon("cogs", cogs);

const routes = [{
  name: "Main",
  path: "/",
  icon: "home",
  component: Main,
},{
  name: "Capture",
  path: "/capture",
  icon: "camera",
  component: Capture,
},{
  name: "Mount",
  path: "/mount",
  icon: "telescope",
  component: Mount,
},{
  name: "Align",
  path: "/align",
  icon: "target",
  component: Align,
},{
  name: "Guide",
  path: "/guide",
  icon: "compass",
  component: Guide,
},{
  name: "Focus",
  path: "/focus",
  icon: "magnify",
  component: Focus,
},{
  name: "Logs",
  path: "/logs",
  icon: "comment",
  component: Logs,
},{
  name: "LiveStack",
  path: "/livestack",
  icon: "camera",
  component: LiveStack,
},/*{
  name: "ControlPanel",
  label: "Control Panel",
  path: "/controlpanel",
  icon: "cogs",
  component: ControlPanel,
}*/];

export {
  routes,
  IconifyIcon,
};