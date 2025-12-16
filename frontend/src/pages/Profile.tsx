import { useProfile } from "../hooks/useProfile";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Loader2, Edit2, Check, X, User, Mail, Shield, Lock } from "lucide-react";

export default function Profile() {
  const { profileQuery, updateMutation } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [originalForm, setOriginalForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (profileQuery.data) {
      const data = {
        name: profileQuery.data.name || "",
        email: profileQuery.data.email || ""
      };
      setForm(data);
      setOriginalForm(data);
    }
  }, [profileQuery.data]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original values
      setForm(originalForm);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Only send name for update since email shouldn't be changed via profile
    updateMutation.mutate({ name: form.name }, {
      onSuccess: () => {
        setOriginalForm(form); // Update original values after successful save
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  const hasChanges = form.name !== originalForm.name;

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <Button onClick={() => profileQuery.refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const user = profileQuery.data;

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">Manage your personal information and account</p>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={handleEditToggle}
              style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
            >
              <Edit2 className="w-4 h-4 relative" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-white">
                  {getInitials(user.name)}
                </div>
                {isEditing && (
                  <button
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => {/* Avatar upload logic */}}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                {isEditing ? (
                  <div className="w-full max-w-md mx-auto sm:mx-0">
                    <Input
                      label=""
                      value={form.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setForm({ ...form, name: e.target.value })
                      }
                      className="text-xl sm:text-2xl font-bold bg-white border-blue-200 focus:border-blue-500"
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </>
                )}
                
                {/* Account Details */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>User ID: <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user._id.substring(0, 8)}...</code></span>
                  </div>
                  {/* If you have createdAt in your user object */}
                  {/* <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            {isEditing ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-1 gap-6">
                    <Input
                      label="Full Name"
                      value={form.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      icon={<User className="w-5 h-5" />}
                      required
                      helperText="This name will be displayed across the platform"
                    />
                    
                    <Input
                      label="Email Address"
                      value={user.email}
                      disabled
                      icon={<Mail className="w-5 h-5" />}
                      helperText="Email cannot be changed. Contact support for assistance."
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending || !hasChanges}
                    className="flex-1 sm:flex-none sm:w-48"
                    variant={hasChanges ? "primary" : "disabled"}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 inline-block mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="flex-1 sm:flex-none sm:w-48"
                  >
                    <X className="w-5 h-5 inline-block mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                    </div>
                    <p className="text-gray-900 font-medium text-lg">{user.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                    </div>
                    <p className="text-gray-900 font-medium text-lg truncate">{user.email}</p>
                  </div>
                </div>

                {/* User ID Display */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-mono truncate">
                      {user._id}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(user._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Save Changes Toast - Optional */}
        {updateMutation.isSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Profile updated successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}