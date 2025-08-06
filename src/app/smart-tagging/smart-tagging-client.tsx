"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { suggestCourseTags } from "@/ai/flows/suggest-tags-for-courses";
import { suggestTagsForTestimonial } from "@/ai/flows/suggest-tags-for-testimonials";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmartTaggingClient() {
  const { toast } = useToast();
  const [courseText, setCourseText] = useState("");
  const [testimonialText, setTestimonialText] = useState("");
  const [courseTags, setCourseTags] = useState<string[]>([]);
  const [testimonialTags, setTestimonialTags] = useState<string[]>([]);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [isTestimonialLoading, setIsTestimonialLoading] = useState(false);

  const handleSuggestCourseTags = async () => {
    if (!courseText.trim()) {
      toast({ title: "Input required", description: "Please enter a course description.", variant: "destructive" });
      return;
    }
    setIsCourseLoading(true);
    setCourseTags([]);
    try {
      const result = await suggestCourseTags({ description: courseText });
      setCourseTags(result.tags);
    } catch (error) {
      console.error("Error suggesting course tags:", error);
      toast({ title: "An error occurred", description: "Could not suggest tags for the course.", variant: "destructive" });
    } finally {
      setIsCourseLoading(false);
    }
  };
  
  const handleSuggestTestimonialTags = async () => {
    if (!testimonialText.trim()) {
      toast({ title: "Input required", description: "Please enter testimonial text.", variant: "destructive" });
      return;
    }
    setIsTestimonialLoading(true);
    setTestimonialTags([]);
    try {
      const result = await suggestTagsForTestimonial({ testimonialText: testimonialText });
      setTestimonialTags(result.suggestedTags);
    } catch (error) {
      console.error("Error suggesting testimonial tags:", error);
      toast({ title: "An error occurred", description: "Could not suggest tags for the testimonial.", variant: "destructive" });
    } finally {
      setIsTestimonialLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Smart Tagging"
        description="Use AI to generate relevant tags for your content."
      />
      <div className="flex-1 overflow-auto p-6 pt-0">
        <Tabs defaultValue="course">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="course">Course Tagger</TabsTrigger>
            <TabsTrigger value="testimonial">Testimonial Tagger</TabsTrigger>
          </TabsList>
          <TabsContent value="course">
            <Card>
              <CardHeader>
                <CardTitle>Suggest Tags for a Course</CardTitle>
                <CardDescription>
                  Paste a course description below to get AI-suggested tags.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="course-description">Course Description</Label>
                  <Textarea
                    id="course-description"
                    placeholder="e.g., Learn about modern web development with React..."
                    rows={6}
                    value={courseText}
                    onChange={(e) => setCourseText(e.target.value)}
                    disabled={isCourseLoading}
                  />
                </div>
                {isCourseLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                     <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                )}
                {courseTags.length > 0 && !isCourseLoading && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Suggested Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {courseTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSuggestCourseTags} disabled={isCourseLoading}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Tags
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="testimonial">
            <Card>
              <CardHeader>
                <CardTitle>Suggest Tags for a Testimonial</CardTitle>
                <CardDescription>
                  Paste testimonial text below to get AI-suggested tags.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid w-full gap-2">
                  <Label htmlFor="testimonial-text">Testimonial Text</Label>
                  <Textarea
                    id="testimonial-text"
                    placeholder="e.g., This course was amazing, I learned so much..."
                    rows={6}
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    disabled={isTestimonialLoading}
                  />
                </div>
                 {isTestimonialLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                     <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                )}
                {testimonialTags.length > 0 && !isTestimonialLoading &&(
                  <div>
                    <h4 className="font-medium text-sm mb-2">Suggested Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {testimonialTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSuggestTestimonialTags} disabled={isTestimonialLoading}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Tags
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
