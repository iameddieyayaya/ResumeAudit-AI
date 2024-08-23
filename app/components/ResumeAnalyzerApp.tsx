"use client"
import React, { useEffect, useState } from "react";
import ResumeUploader from "./ResumeUploader";
import ResumeWorth from "./ResumeWorth";
import { useCompletion } from "ai/react"

const ResumeAnalyzerApp = () => {
  const [showResumeWorth, setShowResumeWorth] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const { completion, isLoading, complete, error } = useCompletion({
    api: '/api/openai',
  })

  useEffect(() => {
    const getResumeWorth = async (text: string) => {
      const messageToSend = `RESUME: ${text}\n\n------\n\n`;
      await complete(messageToSend);
      setShowResumeWorth(true);
      setIsLoadingResume(false);
    }

    if (resumeText !== "") {
      getResumeWorth(resumeText).then();
    }

  }, [resumeText])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        {!showResumeWorth ? (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-800">Resume Analyzer</h1>
            <p className="text-lg text-gray-600">Upload Your Resume</p>
  
            <div className="mt-6">
              <ResumeUploader
                setResumeText={setResumeText}
                setIsLoading={setIsLoadingResume}
              />
            </div>
  
            {(isLoadingResume || isLoading) && (
              <p className="text-blue-500 text-lg font-medium mt-4 animate-pulse">
                Loading...
              </p>
            )}
          </div>
        ) : (
          <ResumeWorth resumeWorth={completion} />
        )}
  
        {error && (
          <p className="text-red-500 text-center mt-4">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzerApp