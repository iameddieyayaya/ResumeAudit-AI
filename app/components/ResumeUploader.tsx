import React, { useState } from "react";
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";
import { MdCloudUpload } from 'react-icons/md';

type Props = {
	setResumeText: React.Dispatch<React.SetStateAction<string>>
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ResumeUploader: React.FC<Props> = ({ setResumeText, setIsLoading }) => {
	const [error, setError] = useState<string>('');
	const [isDragOver, setIsDragOver] = useState<boolean>(false);

	const mergeTextContent = (textContent: TextContent) => {
		return textContent.items.map((item) => {
			const { str, hasEOL } = item as TextItem;
			return str + (hasEOL ? '\n' : '');
		}).join('');
	}

	const readResume = async (pdfFile: File | undefined) => {
		const pdfjs = await import('pdfjs-dist')
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

		if (!pdfFile) {
			return;
		}

		const reader = new FileReader();
		reader.onload = async (event) => {
			const arrayBuffer = event.target?.result as ArrayBuffer;

			if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
				const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer));
				loadingTask.promise.then(
					(pdfDoc) => {
						pdfDoc.getPage(1).then((page) => {
							page.getTextContent().then((textContent) => {
								const extractedText = mergeTextContent(textContent);
								setResumeText(extractedText);
							})
						})
					},
					(error) => {
						console.error(`Error loading PDF: ${error}`);
					}

				)

			}
		}

		reader.readAsArrayBuffer(pdfFile);

	}

	const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setResumeText('');
		setError('');
		setIsLoading(true)

		try {
			const items = event.dataTransfer.items;

			if (!items || items.length !== 1) {
				throw new Error('No files found');
			}

			const item = items[0];

			if (item.kind !== 'file' || item.type !== 'application/pdf') {
				throw new Error('Please drop a single PDF file');
			}

			const file = item.getAsFile();

			if (!file) {
				throw new Error('The PDF not found');
			}

			await readResume(file);

		} catch (error) {
			setError(`Error: ${error}`);
		}
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragOver(true);
	}

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragOver(true);
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragOver(false);
	}

	const handleButtonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsDragOver(false);
		setError('');
		setIsLoading(true)
		const file = event.target.files?.[0];
		readResume(file);
	}

	return (
		<div className="space-y-12">
			<div
				className="flex flex-col items-center justify-center w-full p-20 border-8 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-gray-400"
				onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
				onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
				onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
			>
				<input
					type="file"
					id="file-upload"
					onChange={handleButtonUpload}
					accept="application/pdf"
					hidden
				/>
				<label
					htmlFor="file-upload"
					className="flex flex-col items-center justify-center cursor-pointer"
				>
					<MdCloudUpload className="text-9xl text-gray-500 mb-6" />
					<span className="text-4xl font-medium text-gray-600">Upload Resume</span>
				</label>
			</div>
			{error && <p className="text-red-500 text-2xl">{error}</p>}
		</div>
	);
	
	
	
}

export default ResumeUploader