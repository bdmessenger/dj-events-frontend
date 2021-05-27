import {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaSpinner} from 'react-icons/fa'
import {API_URL} from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function ImageUpload({evtId, imageUploaded, token}) {

    const [image, setImage] = useState(null)

    const [isImageUploading, setIsImageUploading] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsImageUploading(true)
        const formData = new FormData()
        formData.append('files', image)
        formData.append('ref', 'events')
        formData.append('refId', evtId)
        formData.append('field', 'image')

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })

        if(res.ok) {
            imageUploaded()
        } else {
            toast.error('Something Went Wrong')
            setIsImageUploading(false)
        }
    }

    const handleFileChange = e => {
        const file = e.target.files[0]
        if(file) {
            const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
            if(!acceptedImageTypes.includes(file['type'])) {
                toast.error('Wrong file format.')
                e.target.value = null;
                return false
            }
            setImage(file)
        } else {
            setImage(null)
        }
    }
    
    return (
        <div className={styles.form}>
            {isImageUploading ? (
                <div style={{width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '80px'}}>
                    <FaSpinner icon="spinner" className="spinner" />
                </div>
            ) : (
                <>
                    <h1>Upload Event Image</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.file}>
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <input type="submit" value="Upload" className='btn'/>
                    </form>
                </>
            )}
            <ToastContainer/>
        </div>
    )
}
