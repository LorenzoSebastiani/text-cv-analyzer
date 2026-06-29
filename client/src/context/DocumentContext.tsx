import { createContext, useContext, useState, type ReactNode } from "react";
import type { Document } from "../models/Document";
import { useApi } from "./ApiContext";

interface DocumentContextReturn {
    loading: boolean;
    documentList: Document[] | [];
    currentDocument: Document | undefined;
    uploadDocument: (text?: string, document?: FormData) => any;
    getDocuments: () => Promise<Document[] | null> | null;
    getDocumentById: (id: string) => any;  
}

interface Props {
    children: ReactNode
}

const DocumentContext = createContext<DocumentContextReturn | null>(null);

export const DocumentProvider = ({children}: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [documentList, setDocumentList] = useState<Document[] | []>([])
    const [currentDocument, setCurrentDocument] = useState<Document | undefined>(undefined)
    const serverApi = useApi()

    const uploadDocument = async (text?: string, document?: FormData) => {
    if (!serverApi) return null;

    try {
        setLoading(true);

        if (text) {
            const { data } = await serverApi.post('/upload', { text })
            return data;
        } else if (document) {
            const { data } = await serverApi.post('/upload', document)
            return data;
        }

        return null;
    } catch (error: any) {
        console.error('Error upload axios: ', error)
        return { error: error.response?.data?.error ?? 'Errore durante il caricamento' }
    } finally {
        setLoading(false);
    }
}

    const getDocuments = async () => {
        if(!serverApi) return null;

        try {
            setLoading(true);

            const {status, data} = await serverApi.get('/documents');

            if(status===200){
                setDocumentList(data);
                return data;
            }

            return null;
        } catch (error) {
            console.error('Error getDocuments axios: ', error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getDocumentById = async (id: string) => {
        if(!serverApi) return null;

        try {
            setLoading(true);

            const {status, data} = await serverApi.get(`/documents/${id}`);

            if(status === 200) {
                setCurrentDocument(data);
                return data;
            }

            return null;
        } catch (error) {
            console.error('Error getDocumentById axios: ', error)
            return null
        } finally {
            setLoading(false)
        }
    }

    return (
        <DocumentContext.Provider value={{loading, documentList, currentDocument, uploadDocument, getDocuments, getDocumentById}} >
            {children}
        </DocumentContext.Provider>
    )
}

export const useDocument = () => useContext(DocumentContext)