'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AdminIcons } from '@/components/admin-icons';
import { Search, ArrowRight, Mail, HelpCircle, Book, MessageSquare, FileText } from 'lucide-react';

export default function HelpSupportPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [supportMessage, setSupportMessage] = React.useState('');

  const handleSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send the support request
    alert('Support request submitted: ' + supportMessage);
    setSupportMessage('');
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('Help & Support')}</h2>
          <p className="text-muted-foreground">{t('Resources and assistance for administrators')}</p>
        </div>
      </div>
      
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t('Search help documentation...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>
      
      <Tabs defaultValue="documentation" className="w-full">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="documentation" className="data-[state=active]:bg-primary/10">
            <Book className="h-4 w-4 mr-2" />
            {t('Documentation')}
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-primary/10">
            <HelpCircle className="h-4 w-4 mr-2" />
            {t('FAQ')}
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('Contact Support')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documentation">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.Dashboard className="h-5 w-5 mr-2 text-primary" />
                  {t('Admin Dashboard')}
                </CardTitle>
                <CardDescription>
                  {t('Learn about dashboard features and metrics')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Comprehensive guide to using the admin dashboard, including understanding metrics, managing users, and configuring system settings.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.RiskAlerts className="h-5 w-5 mr-2 text-primary" />
                  {t('Risk Analysis System')}
                </CardTitle>
                <CardDescription>
                  {t('Understanding the risk assessment process')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Detailed explanation of risk scoring algorithms, interpreting risk factors, and taking appropriate actions for flagged DPRs.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.Users className="h-5 w-5 mr-2 text-primary" />
                  {t('User Management')}
                </CardTitle>
                <CardDescription>
                  {t('Managing user accounts and permissions')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Learn how to add users, manage roles, reset passwords, and configure access permissions for different user groups.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.Reports className="h-5 w-5 mr-2 text-primary" />
                  {t('Reports & Analytics')}
                </CardTitle>
                <CardDescription>
                  {t('Generating and interpreting reports')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Guide to creating custom reports, scheduling automated reports, and analyzing system data for insights and optimization.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.Database className="h-5 w-5 mr-2 text-primary" />
                  {t('System Logs')}
                </CardTitle>
                <CardDescription>
                  {t('Monitoring and troubleshooting')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Understanding system logs, identifying common errors, and troubleshooting techniques for resolving issues.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AdminIcons.Settings className="h-5 w-5 mr-2 text-primary" />
                  {t('System Configuration')}
                </CardTitle>
                <CardDescription>
                  {t('Customizing system settings')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  {t('Guide to configuring system parameters, customizing workflows, and optimizing performance for your specific needs.')}
                </p>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-between">
                  {t('Read Documentation')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                {t('Frequently Asked Questions')}
              </CardTitle>
              <CardDescription>
                {t('Common questions and answers for administrators')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{t('How do I reset a users password?')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('Navigate to the Users section, find the user, and click on the "Reset Password" option. You can either set a temporary password or send them an email with a password reset link.')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">{t('How is the risk score calculated?')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('The risk score is calculated based on multiple factors including document completeness, budget accuracy, timeline feasibility, and historical data comparison. The ML model analyzes these factors and assigns weights based on their importance.')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">{t('Can I customize the dashboard layout?')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('Yes, you can customize the dashboard by going to Settings > Appearance > Dashboard Layout. You can drag and drop widgets, add or remove metrics, and save different layouts for different roles.')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">{t('How often is the system backed up?')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('The system performs automatic backups daily at midnight. Full database backups are performed weekly on Sundays. You can also initiate manual backups from the System Maintenance section.')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">{t('How do I generate a custom report?')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('Go to the Reports section and click on "Create New Report". You can select from various templates or create a custom report by choosing specific metrics, date ranges, and visualization types.')}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{t('Didnt find what youre looking for?')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('Check our comprehensive documentation or contact support for personalized assistance.')}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary">
                    <FileText className="h-4 w-4 mr-2" />
                    {t('Full Documentation')}
                  </Button>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('Contact Support')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card className="shadow-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                {t('Contact Support')}
              </CardTitle>
              <CardDescription>
                {t('Get help from our technical support team')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportRequest}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      {t('Subject')}
                    </label>
                    <Input id="subject" placeholder={t('Briefly describe your issue')} />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      {t('Category')}
                    </label>
                    <select id="category" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="technical">{t('Technical Issue')}</option>
                      <option value="account">{t('Account Management')}</option>
                      <option value="feature">{t('Feature Request')}</option>
                      <option value="billing">{t('Billing & Licensing')}</option>
                      <option value="other">{t('Other')}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      {t('Priority')}
                    </label>
                    <select id="priority" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="low">{t('Low - General inquiry')}</option>
                      <option value="medium">{t('Medium - Issue affecting work')}</option>
                      <option value="high">{t('High - Serious problem')}</option>
                      <option value="critical">{t('Critical - System down')}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      {t('Message')}
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder={t('Please provide details about your issue or question...')} 
                      rows={5}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="attachment" className="text-sm font-medium">
                      {t('Attachments (optional)')}
                    </label>
                    <Input id="attachment" type="file" />
                    <p className="text-xs text-muted-foreground">
                      {t('Upload screenshots or relevant files. Max size 10MB.')}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      {t('Submit Support Request')}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h3 className="text-xl font-medium">{t('Need immediate assistance?')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('Contact our dedicated support team by phone or email')}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+91 1800 123 4567</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>support@dprai-system.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}