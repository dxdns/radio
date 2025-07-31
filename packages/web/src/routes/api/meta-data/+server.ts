import type { RequestHandler } from "./$types"
import { z } from "zod"

const form = z.object({
	streamUrl: z.string().url("invalid")
})

export const GET: RequestHandler = async ({ fetch, url }) => {
	const parseResult = form.safeParse({
		streamUrl: url.searchParams.get("streamUrl")
	})

	if (!parseResult.success) {
		return new Response(JSON.stringify({ error: parseResult.error.format() }), {
			status: 400
		})
	}

	const { streamUrl } = parseResult.data

	return new Response(
		new ReadableStream({
			async start(controller) {
				let isClosed = false

				const safeEnqueue = (data: string) => {
					if (!isClosed) controller.enqueue(new TextEncoder().encode(data))
				}

				const safeClose = () => {
					if (!isClosed) {
						isClosed = true
						controller.close()
					}
				}

				try {
					const res = await fetch(streamUrl, {
						headers: {
							"Icy-MetaData": "1"
						}
					})

					const metaint = parseInt(res.headers.get("icy-metaint") || "")
					if (!metaint) {
						const radioName = res.headers.get("icy-name") || "unknown"
						safeEnqueue(`data: ${radioName}\n\n`)
						safeClose()
						return
					}

					const reader = res.body!.getReader()
					let audioData = new Uint8Array()

					while (true) {
						const { done, value } = await reader.read()
						if (done) {
							safeClose()
							break
						}
						if (!value) continue

						const merged = new Uint8Array(audioData.length + value.length)
						merged.set(audioData)
						merged.set(value, audioData.length)
						audioData = merged

						while (audioData.length >= metaint + 1) {
							audioData = audioData.slice(metaint)

							const metaLengthByte = audioData[0]
							const metaLength = metaLengthByte * 16

							if (audioData.length < 1 + metaLength) break

							const metaDataBlock = audioData.slice(1, 1 + metaLength)
							const metaStr = new TextDecoder("utf-8")
								.decode(metaDataBlock)
								.replace(/\0/g, "")
								.replace(/�/g, "ô")
								.replace(/À/g, "ã")
								.replace(/‡/g, "ç")

							const match = /StreamTitle='([^']*)'/.exec(metaStr)
							if (match && match[1]) {
								const song = match[1]
								safeEnqueue(`data: ${song}\n\n`)
							}

							audioData = audioData.slice(1 + metaLength)
						}
					}
				} catch (error: any) {
					console.error("error:", error.message)
					safeEnqueue(`event: error\ndata: ${error.message}\n\n`)
					safeClose()
					return
				}
			}
		}),
		{
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive"
			}
		}
	)
}
