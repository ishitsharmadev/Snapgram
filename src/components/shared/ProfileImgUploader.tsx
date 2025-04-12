import {useCallback, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'

type ProfileImgUploaderProps = {
    feildChange:  (FILES:File[])=>void,
    imageUrl?: string
}

function ProfileImgUploader({feildChange, imageUrl}:ProfileImgUploaderProps) {
    
    const [fileUrl, setFileUrl] = useState(imageUrl);
    
    const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
        // Do something with the files
        const imageUrl = URL.createObjectURL(acceptedFiles[0]);
        setFileUrl(imageUrl);
        feildChange(acceptedFiles);
      }, [])
      const {getRootProps, getInputProps} = useDropzone({onDrop})
    
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            fileUrl?(
                <div className='w-full items-center justify-start flex space-x-6 py-6'>
                    <img src={fileUrl} alt="profile-img" className='w-36 h-36 rounded-full  cursor-pointer' />
                    <p className='text-sm text-blue-600'>Change profile photo</p>
                </div>
            ):(
                <p className='text-sm text-blue-600 cursor-pointer'>Get a pofile pic</p>
            )
          }
        </div>
  )
}

export default ProfileImgUploader
