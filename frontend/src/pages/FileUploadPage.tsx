import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function FileUploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This is a placeholder page for file uploads. You can use the Add Item form in Category views for the real upload flow.
      </p>
      <Link to="/" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto">Back to Home</Button>
      </Link>
    </div>
  );
}
