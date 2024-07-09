"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Mic } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const Bot = () => {
    const [text, setText] = useState("");
    const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>();

    const language = "en-US"

    const availableVoices = voices?.filter(({ lang }) => lang === language);
    const activeVoice =
        availableVoices?.find(({ name }) => name.includes('Google'))
        || availableVoices?.[0];

    useEffect(() => {
        const voices = window.speechSynthesis.getVoices();
        if (Array.isArray(voices) && voices.length > 0) {
            setVoices(voices);
            return;
        }
        if ('onvoiceschanged' in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = function () {
                const voices = window.speechSynthesis.getVoices();
                setVoices(voices);
            }
        }
    }, []);

    function handleOnRecord() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition();

        recognition.onresult = async function(event) {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
            handleEnhanceDescription(transcript);
            console.log("event", event)
        }

        recognition.start();
    }

    const handleEnhanceDescription = async (text: string) => {
        if (!text) {
            alert({
                title: "Error",
                description: "Bio is empty.",
            });
            return;
        }

        const options = {
            method: 'POST',
            url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
            headers: {
                'x-rapidapi-key': 'e9a0d93d50mshe98a3e570cb3576p1bc973jsn3823a95811ea',
                'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                messages: [
                    {
                        role: 'user',
                        content: "Enhance the following Bio for me (Only Give me the Description, without any styling, you can make them as pointer's if necessary): " + text
                    }
                ],
                system_prompt: '',
                temperature: 0.9,
                top_k: 5,
                top_p: 0.9,
                max_tokens: 256,
                web_access: false
            }
        };
        try {
            const response = await axios.request(options);
            console.log(response.data);
            const enhancedText = response.data.result;
            console.log(enhancedText);

            if (!activeVoice) return;

            let utterance = new SpeechSynthesisUtterance(enhancedText);

            const voices = window.speechSynthesis.getVoices();
            console.log('voices: ', voices);

            utterance.voice = activeVoice;

            window.speechSynthesis.speak(utterance)

        } catch (error) {
            console.error("Error enhancing Bio:", error);
        }
    };

    return (
        <div className='bg-black h-screen'>
            <div className='flex items-center justify-center h-screen'>
                <Button onClick={handleOnRecord}>
                    <Mic />
                </Button>
            </div>
            <p>
               Spoken : { text }
            </p>
        </div>
    );
};

export default Bot;
