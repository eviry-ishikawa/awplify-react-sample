import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react"

import { listNotes } from "./graphql/queries"
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from "./graphql/mutations"
import './App.css';
import { API } from 'aws-amplify';

const initialFormState = {
  id: 0,
  name: "",
  description:""
}

type Note = {
  id: number,
  name: string,
  description: string
}

function App() {
  const [notes, setNotes] = useState<Note[]>([] as Note[] )
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchNotes()
  },[])

  const fetchNotes = async() => {
    const apiData:any = await API.graphql({ query: listNotes })
    setNotes(apiData.data!.listNotes.items)
  };

  const createNote = async() => {
    if(!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } })
    setNotes([...notes, formData])
    setFormData(initialFormState)
  }

  const deleteNote = async(id:number) => {
    const newNotesArray = notes.filter(note => note.id !== id)
    setNotes(newNotesArray)
    await API.graphql({ query: deleteNoteMutation, variables: { input: id  }})
  }

  const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, name:e.target.value})
  }

  const handleDescriptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, description:e.target.value})
  }

  return (
    <div className="App">
      <header>
        <h1>We now have auth!</h1>
      </header>
      <div>
          <input type="text" value={formData.name} onChange={handleNameChange} />
          <input type="text" value={formData.description} onChange={handleDescriptionChange}/>
      </div>
      <div>
        <button onClick={createNote}>Create Note</button>
      </div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => 
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note?.id)}>Delete Button</button>
          </div>
        )}
      </div>
      <AmplifySignOut></AmplifySignOut>
    </div>
  );
}

export default withAuthenticator(App);
