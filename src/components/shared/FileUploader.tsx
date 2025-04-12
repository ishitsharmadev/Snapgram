import React, {useCallback, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'/**react-dropzone is a react component hepls you to provide a functionality lke drag and drop */
import { Button } from '../ui/button';

type FileUploaderProps = {
    feildChange:(FILES:File[])=>void;
    mediaUrl:string
}

function FileUploader({
    feildChange,
    mediaUrl
}:FileUploaderProps) {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl || '');

    const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
        // Do something with the files
        setFile(acceptedFiles);
        feildChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));

      }, [])
      const {getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept:{
            'image/*':['.png', '.jpeg', '.jpg', '.svg', '.avif']
        }
    
    });
  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-default'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        fileUrl ?(
            <>
            <div className='flex flex-1 w-full p-5 lg:p-10'>
                <img
                className='file_uploader-img' 
                src={fileUrl} 
                alt="image" 
                />
                
            </div>
            <p className='file_uploader-label'>Click or drag photo to replace</p>
            </>
        ):
          (<div className='file_uploader-box'>
            <img src="/assets/icons/file-upload.svg" alt="file-upload" width={96} height={77} />
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
            <Button
            className="shad-button_dark_4"
            >Select from Computer</Button>
          </div>)
      }
    </div>
  )
}

export default FileUploader
