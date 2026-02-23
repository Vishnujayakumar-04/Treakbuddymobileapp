import fetch from 'node-fetch';

async function testGroq() {
    const apiKey = "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";
    console.log("Testing with key:", apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4));

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: 'hello' }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

testGroq();
