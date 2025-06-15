
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import AdminSidebarHeader from "./sidebar/AdminSidebarHeader";
import AdminSidebarContent from "./sidebar/AdminSidebarContent";
import AdminSidebarFooter from "./sidebar/AdminSidebarFooter";

const AdminSidebar = () => {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <AdminSidebarHeader />
      <AdminSidebarContent />
      <AdminSidebarFooter />
    </Sidebar>
  );
};

export default AdminSidebar;
