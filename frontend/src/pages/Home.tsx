import { useAppSelector } from '../features/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, CreditCard, Clock } from 'lucide-react';

export function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.categories);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground text-lg">Your secure locker is ready and protected.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{categories.length || 7}</div>
            <p className="text-xs text-muted-foreground pt-1">Securely organized</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Stored</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground pt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Access</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Just now</div>
            <p className="text-xs text-muted-foreground pt-1">Session active</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">Secure Storage</h3>
        <p className="mt-2">Select a category from the sidebar to view or add new sensitive documents.</p>
      </div>
    </div>
  );
}
