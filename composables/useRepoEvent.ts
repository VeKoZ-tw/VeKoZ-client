import { defineStore } from 'pinia'
import useVenoniaApi from './useVenoniaApi'
import type { IEvent } from '~/types/event'
import type { IEventTemplate } from '~/types/eventTemplate'

export default defineStore('event', () => {
    const defaultApi = useVenoniaApi()
    async function postEvent(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'post',
            body,
        })
        return response.json()
    }
    async function patchEvent(body: IEventTemplate) {
        const response = await defaultApi.authRequest(`/event`, {
            method: 'patch',
            body,
        })
        return response.json()
    }
    async function getEventList(params: IEvent) {
        const response = await defaultApi.authRequest(`/event/list`, {
            method: 'get',
            params,
        })
        return response.json()
    }
    async function getEvent(eventId: string) {
        const response = await defaultApi.authRequest(`/event/${eventId}`, {
            method: 'get',
        })
        return response.json()
    }
    async function getEventTemplate() {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'get',
        })
        return response.json()
    }
    async function putEventTemplate(body: any) {
        const response = await defaultApi.authRequest(`/event/template`, {
            method: 'put',
            body,
        })
        return response.text()
    }
    return {
        // Event
        getEventList,
        getEvent,
        postEvent,
        patchEvent,
        // Template
        getEventTemplate,
        putEventTemplate,
    }
})