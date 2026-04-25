import { useAppSelector } from '../features/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Users, Link2 } from 'lucide-react';
import { Testimonials } from '../components/ui/twitter-testimonial-cards';

export function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.categories);
  const { persons } = useAppSelector((state) => state.persons);
  const { linkedUsers } = useAppSelector((state) => state.connections);

  const totalVaults = persons.length + linkedUsers.length;

  
  const personProfiles = persons.map((p) => ({
    label: p.name,
    icon: p.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}&backgroundColor=111,222,333&fontFamily=Inter&fontWeight=700&fontSize=40`,
    isLinked: false,
  }));

  const linkedProfiles = linkedUsers.map((lu) => ({
    label: lu.user.name,
    icon: lu.user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${lu.user.name}&backgroundColor=001,030,060&fontFamily=Inter&fontWeight=700&fontSize=40`,
    isLinked: true,
  }));

  const allProfiles = [...personProfiles, ...linkedProfiles];

  const testimonialCards = allProfiles.map((p) => {
    return {
      username: p.label,
      avatar: p.icon,
      verified: p.isLinked,
      handle: p.isLinked ? "External Linked Vault" : "Private Family Member",
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground text-lg">Your secure locker is ready and protected.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <p className="text-xs text-muted-foreground pt-1">Securely organized</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{persons.length}</div>
            <p className="text-xs text-muted-foreground pt-1">Family profiles</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Vaults</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkedUsers.length}</div>
            <p className="text-xs text-muted-foreground pt-1">External connections</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Visual Table of Members */}
      {allProfiles.length > 0 && (
        <div className="flex flex-col gap-6 py-6 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold tracking-tight">Active Vault Access</h2>
            <p className="text-sm text-muted-foreground">List of all members and accounts with authorized access to your ecosystem.</p>
          </div>
          <Testimonials cards={testimonialCards} />
        </div>
      )}

      {/* Global Summary */}
      <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground bg-card/10 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Shield className="h-24 w-24" />
        </div>
        <h3 className="text-lg font-medium text-foreground relative z-10">Secure Multi-Vault Storage</h3>
        <p className="mt-2 text-sm leading-relaxed max-w-md mx-auto relative z-10">
          Your infrastructure is currently managing <strong>{categories.length}</strong> categories across <strong>{totalVaults}</strong> active vaults. All data is encrypted and protected.
        </p>
      </div>
    </div>
  );
}
