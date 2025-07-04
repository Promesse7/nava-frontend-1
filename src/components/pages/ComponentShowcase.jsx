import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Send, 
  Download, 
  Settings, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CreditCard,
  Search,
  Filter,
  Bell,
  Check,
  X,
  Plus,
  Edit,
  Trash,
  Save,
  Upload,
  Share,
  Home,
  Users,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';

import {
  EnhancedButton,
  EnhancedCard,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  IconTab,
  StepTabs,
  EnhancedModal,
  ConfirmationModal,
  ProgressIndicator,
  LinearProgress,
  CircularProgress,
  EnhancedForm,
  FormField,
  FormSubmitButton,
  FormSection,
  createValidator,
  EnhancedLoadingSpinner,
  Skeleton,
  useToast
} from '../ui';

const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [tabValue, setTabValue] = useState('overview');
  const [stepValue, setStepValue] = useState(0);
  const [progress, setProgress] = useState(65);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  const steps = [
    { title: 'Information', description: 'Basic details' },
    { title: 'Preferences', description: 'Your choices' },
    { title: 'Review', description: 'Confirm details' },
    { title: 'Complete', description: 'All done!' },
  ];

  const formValidation = {
    name: createValidator.required('Name is required'),
    email: createValidator.email(),
    phone: createValidator.phone(),
    message: {
      required: true,
      min: 10,
      message: 'Message must be at least 10 characters'
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    toast.success('Form submitted successfully!', {
      title: 'Success',
      action: { label: 'View', onClick: () => console.log('View clicked') }
    });
  };

  const handleProgressUpdate = () => {
    const newProgress = Math.min(progress + 15, 100);
    setProgress(newProgress);
    if (newProgress === 100) {
      toast.success('Progress completed!');
    }
  };

  const showToastExamples = () => {
    toast.success('Success message!');
    setTimeout(() => toast.error('Error message!'), 1000);
    setTimeout(() => toast.warning('Warning message!'), 2000);
    setTimeout(() => toast.info('Info message!'), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-surface p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display-2 font-bold text-primary mb-4">
            Enhanced Component Library
          </h1>
          <p className="text-body-lg text-secondary max-w-2xl mx-auto">
            Sophisticated, accessible, and elegant React components with smooth animations 
            and modern design patterns. Built for the XPressit platform.
          </p>
        </motion.div>

        {/* Component Sections */}
        <EnhancedTabs value={tabValue} onValueChange={setTabValue} variant="underline">
          <TabsList className="mb-8 justify-center">
            <TabsTrigger value="buttons">Buttons & Actions</TabsTrigger>
            <TabsTrigger value="inputs">Forms & Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards & Layout</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & Status</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
          </TabsList>

          {/* Buttons & Actions */}
          <TabsContent value="buttons">
            <div className="space-y-8">
              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>
                    Enhanced buttons with sophisticated hover effects, loading states, and animations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <EnhancedButton variant="primary" glow>
                      Primary
                    </EnhancedButton>
                    <EnhancedButton variant="secondary">
                      Secondary
                    </EnhancedButton>
                    <EnhancedButton variant="ghost">
                      Ghost
                    </EnhancedButton>
                    <EnhancedButton variant="outline">
                      Outline
                    </EnhancedButton>
                    <EnhancedButton variant="danger">
                      Danger
                    </EnhancedButton>
                    <EnhancedButton variant="success">
                      Success
                    </EnhancedButton>
                    <EnhancedButton variant="gradient" glow>
                      Gradient
                    </EnhancedButton>
                    <EnhancedButton loading>
                      Loading
                    </EnhancedButton>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Button Sizes & Icons</CardTitle>
                  <CardDescription>
                    Various sizes and icon combinations for different use cases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <EnhancedButton size="xs">Extra Small</EnhancedButton>
                      <EnhancedButton size="sm">Small</EnhancedButton>
                      <EnhancedButton size="md">Medium</EnhancedButton>
                      <EnhancedButton size="lg">Large</EnhancedButton>
                      <EnhancedButton size="xl">Extra Large</EnhancedButton>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <EnhancedButton icon={<Heart size={16} />}>
                        With Icon
                      </EnhancedButton>
                      <EnhancedButton icon={<Download size={16} />} iconPosition="right">
                        Icon Right
                      </EnhancedButton>
                      <EnhancedButton size="icon" variant="secondary">
                        <Settings size={16} />
                      </EnhancedButton>
                      <EnhancedButton size="icon-lg" variant="ghost">
                        <User size={20} />
                      </EnhancedButton>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </TabsContent>

          {/* Forms & Inputs */}
          <TabsContent value="inputs">
            <div className="space-y-8">
              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Enhanced Form Demo</CardTitle>
                  <CardDescription>
                    Complete form with validation, different input types, and smooth animations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedForm
                    initialValues={{}}
                    validationSchema={formValidation}
                    onSubmit={handleFormSubmit}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        icon={<User size={16} />}
                        required
                      />
                      
                      <FormField
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        icon={<Mail size={16} />}
                        required
                      />
                      
                      <FormField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        icon={<Phone size={16} />}
                        helper="Include country code"
                      />
                      
                      <FormField
                        name="location"
                        label="Location"
                        component="select"
                        placeholder="Select your location"
                        options={selectOptions}
                        icon={<MapPin size={16} />}
                      />
                    </div>
                    
                    <FormField
                      name="message"
                      label="Message"
                      component="textarea"
                      placeholder="Tell us about your requirements..."
                      helper="Minimum 10 characters required"
                      required
                    />
                    
                    <FormSubmitButton loadingText="Submitting your request...">
                      Submit Form
                    </FormSubmitButton>
                  </EnhancedForm>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Input Variants</CardTitle>
                  <CardDescription>
                    Different input styles and states for various design needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <EnhancedInput
                      label="Default Input"
                      placeholder="Enter text..."
                      variant="default"
                    />
                    
                    <EnhancedInput
                      label="Minimal Input"
                      placeholder="Enter text..."
                      variant="minimal"
                    />
                    
                    <EnhancedInput
                      label="Filled Input"
                      placeholder="Enter text..."
                      variant="filled"
                    />
                    
                    <EnhancedInput
                      label="Floating Label"
                      placeholder="Enter text..."
                      variant="floating"
                    />
                    
                    <EnhancedInput
                      label="With Icon"
                      placeholder="Search..."
                      icon={<Search size={16} />}
                    />
                    
                    <EnhancedInput
                      label="Password"
                      type="password"
                      placeholder="Enter password..."
                    />
                    
                    <EnhancedInput
                      label="Error State"
                      placeholder="Enter text..."
                      error="This field has an error"
                    />
                    
                    <EnhancedInput
                      label="Success State"
                      placeholder="Enter text..."
                      success="Looks good!"
                    />
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </TabsContent>

          {/* Cards & Layout */}
          <TabsContent value="cards">
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <EnhancedCard variant="default" hover>
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>
                      Standard card with border and hover effects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body text-secondary">
                      This is the default card variant with subtle shadows and smooth hover animations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <EnhancedButton variant="ghost" size="sm">
                      Learn More
                    </EnhancedButton>
                  </CardFooter>
                </EnhancedCard>

                <EnhancedCard variant="elevated" glow>
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                    <CardDescription>
                      Card with enhanced shadows and glow effects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body text-secondary">
                      Perfect for highlighting important content with dramatic shadows.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <EnhancedButton variant="primary" size="sm">
                      Get Started
                    </EnhancedButton>
                  </CardFooter>
                </EnhancedCard>

                <EnhancedCard variant="gradient" hover>
                  <CardHeader>
                    <CardTitle>Gradient Card</CardTitle>
                    <CardDescription>
                      Subtle gradient background for modern appeal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body text-secondary">
                      Features a beautiful gradient background that responds to interactions.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <EnhancedButton variant="secondary" size="sm">
                      Explore
                    </EnhancedButton>
                  </CardFooter>
                </EnhancedCard>
              </div>

              <EnhancedCard variant="dark" className="text-white">
                <CardHeader>
                  <CardTitle className="text-white">Dark Theme Card</CardTitle>
                  <CardDescription className="text-gray-300">
                    Dark variant perfect for modern interfaces and contrast.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200">
                        This card demonstrates the dark theme variant with proper contrast and readability.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <EnhancedButton variant="ghost" size="icon-sm">
                        <Heart size={16} />
                      </EnhancedButton>
                      <EnhancedButton variant="ghost" size="icon-sm">
                        <Share size={16} />
                      </EnhancedButton>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </TabsContent>

          {/* Feedback & Status */}
          <TabsContent value="feedback">
            <div className="space-y-8">
              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>
                    Various progress components for showing status and completion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <LinearProgress 
                        value={progress} 
                        showLabel 
                        variant="gradient"
                      />
                      <div className="mt-4 flex gap-2">
                        <EnhancedButton 
                          size="sm" 
                          onClick={handleProgressUpdate}
                          disabled={progress >= 100}
                        >
                          Update Progress
                        </EnhancedButton>
                        <EnhancedButton 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setProgress(0)}
                        >
                          Reset
                        </EnhancedButton>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <CircularProgress value={75} variant="success" />
                      <CircularProgress value={45} variant="warning" />
                      <CircularProgress value={90} variant="default" />
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                  <CardDescription>
                    Different loading spinners and skeleton components.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <EnhancedLoadingSpinner variant="default" size="lg" />
                      <p className="text-sm text-gray-600 mt-2">Default</p>
                    </div>
                    <div className="text-center">
                      <EnhancedLoadingSpinner variant="dots" size="lg" />
                      <p className="text-sm text-gray-600 mt-2">Dots</p>
                    </div>
                    <div className="text-center">
                      <EnhancedLoadingSpinner variant="bars" size="lg" />
                      <p className="text-sm text-gray-600 mt-2">Bars</p>
                    </div>
                    <div className="text-center">
                      <EnhancedLoadingSpinner variant="ripple" size="lg" />
                      <p className="text-sm text-gray-600 mt-2">Ripple</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <Skeleton width="w-3/4" height="h-4" />
                    <Skeleton width="w-1/2" height="h-4" />
                    <Skeleton width="w-5/6" height="h-4" />
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Toast Notifications</CardTitle>
                  <CardDescription>
                    Animated toast messages for user feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <EnhancedButton 
                      onClick={showToastExamples}
                      icon={<Bell size={16} />}
                    >
                      Show Toast Examples
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="secondary"
                      onClick={() => setIsModalOpen(true)}
                      icon={<Settings size={16} />}
                    >
                      Open Modal
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="danger"
                      onClick={() => setIsConfirmOpen(true)}
                      icon={<Trash size={16} />}
                    >
                      Confirm Dialog
                    </EnhancedButton>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </TabsContent>

          {/* Navigation */}
          <TabsContent value="navigation">
            <div className="space-y-8">
              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Tab Navigation</CardTitle>
                  <CardDescription>
                    Different tab styles and orientations for content organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedTabs defaultValue="tab1" variant="pills">
                    <TabsList className="mb-4">
                      <TabsTrigger value="tab1">First Tab</TabsTrigger>
                      <TabsTrigger value="tab2">Second Tab</TabsTrigger>
                      <TabsTrigger value="tab3">Third Tab</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <p className="text-body text-secondary">Content for the first tab.</p>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <p className="text-body text-secondary">Content for the second tab.</p>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <p className="text-body text-secondary">Content for the third tab.</p>
                    </TabsContent>
                  </EnhancedTabs>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Icon Tabs</CardTitle>
                  <CardDescription>
                    Tabs with icons and badges for enhanced navigation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <IconTab
                      value="home"
                      icon={<Home size={16} />}
                      label="Home"
                    />
                    <IconTab
                      value="users"
                      icon={<Users size={16} />}
                      label="Users"
                      badge="5"
                    />
                    <IconTab
                      value="analytics"
                      icon={<BarChart3 size={16} />}
                      label="Analytics"
                    />
                    <IconTab
                      value="reports"
                      icon={<FileText size={16} />}
                      label="Reports"
                      badge="new"
                    />
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <CardHeader>
                  <CardTitle>Step Navigation</CardTitle>
                  <CardDescription>
                    Step-by-step navigation for wizards and multi-step forms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StepTabs
                    steps={steps}
                    currentStep={stepValue}
                    onStepChange={setStepValue}
                  />
                  
                  <div className="mt-6 flex gap-4">
                    <EnhancedButton 
                      variant="ghost"
                      onClick={() => setStepValue(Math.max(0, stepValue - 1))}
                      disabled={stepValue === 0}
                    >
                      Previous
                    </EnhancedButton>
                    <EnhancedButton 
                      onClick={() => setStepValue(Math.min(steps.length - 1, stepValue + 1))}
                      disabled={stepValue === steps.length - 1}
                    >
                      Next
                    </EnhancedButton>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          </TabsContent>
        </EnhancedTabs>

        {/* Modals */}
        <EnhancedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Enhanced Modal"
          description="This is a sophisticated modal with smooth animations."
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-body text-secondary">
              This modal demonstrates the enhanced modal component with proper focus management,
              escape key handling, and beautiful animations.
            </p>
            
            <div className="flex gap-3 justify-end">
              <EnhancedButton 
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </EnhancedButton>
              <EnhancedButton onClick={() => setIsModalOpen(false)}>
                Confirm
              </EnhancedButton>
            </div>
          </div>
        </EnhancedModal>

        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            toast.success('Action confirmed!');
          }}
          title="Confirm Action"
          message="Are you sure you want to proceed with this action? This cannot be undone."
          variant="danger"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default ComponentShowcase;