"use client"
import React, { useEffect, useState } from "react";
import ResumeUploader from "./ResumeUploader";
import ResumeWorth from "./ResumeWorth";
import { useCompletion } from "ai/react"
import { AiOutlineGithub } from 'react-icons/ai'; // Import GitHub icon from react-icons


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
            <h1 className="text-4xl font-extrabold text-gray-800">Analyze Resume</h1>
            <div className="mt-6">
              <ResumeUploader
                setResumeText={setResumeText}
                setIsLoading={setIsLoadingResume}
              />
            </div>

            {(isLoadingResume || isLoading) && (
              <p className="text-blue-500 text-xl font-medium mt-4 animate-pulse">
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

        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/iameddieyayaya/ResumeAudit-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-800 hover:text-gray-600"
          >
            <AiOutlineGithub className="text-3xl mr-2" />
            <span className="text-lg">View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );

}

export default ResumeAnalyzerApp