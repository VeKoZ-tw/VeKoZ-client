<template>
    <el-row class="events" :gutter="8">
        <template v-if="!repoUI.isLarge">
            <FormSearchEvents v-model="form" ref="formRef" class="events__form events__form--mobile"
                @change="getEventList()">
            </FormSearchEvents>
        </template>
        <el-col v-else :span="searchFromSize">
            <div class="events__sideContainer">
                <el-card class="sideContainer__card">
                    <FormSearchEvents v-model="form" ref="formRef" class="events__form" @change="getEventList()">
                    </FormSearchEvents>
                </el-card>
                <br />
                <div class="sideContainer__ads">
                    廣告合作徵求中
                </div>
            </div>
        </el-col>
        <el-col :span="cardGroupSize">
            <el-row :gutter="8" class="events__mainContainer"
                :class="{ 'events__mainContainer--mt-0': repoUI.isLarge }">
                <el-col v-loading="isLoading" v-for="(item, index) in eventList" :span="cardSize"
                    class="index__cardWrap">
                    <MoleculeVenoniaCard class="index__card">
                        <template #default>
                            <NuxtLink :to="`/event/${item.id}`">
                                <img v-if="item.banner" class="card__image" :src="item.banner" :alt="item.name"
                                    onerror="this.onerror=null;this.src='@/assets/logo/500_250.png'">
                                <img v-else class="card__image" src="@/assets/logo/500_250.png" :alt="item.name">
                            </NuxtLink>
                        </template>
                        <template #footer>
                            <table class="card__footTable">
                                <tbody>
                                    <tr>
                                        <td colspan="2">
                                            <div class="table__time">
                                                <span class="time__span">
                                                    {{ getDate(item) }}
                                                    <!-- cardSize: {{ cardSize }} -->
                                                </span>

                                                <span class="time__span">
                                                    {{ getTimes(item) }}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <img class="table__logo" :src="item.organizerLogo">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <NuxtLink :to="`/event/${item.id}`">
                                                {{ item.name }}
                                            </NuxtLink>
                                        </td>
                                        <!-- <td>
                                            <div class="footer__offer">
                                                NTD 250
                                            </div>
                                        </td> -->
                                    </tr>
                                    <tr>
                                        <td>{{ item.locationAddressRegion || '地點未定' }}</td>
                                        <td></td>
                                        <td>
                                            <div class="footer__offer">
                                                NTD 250
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <!-- <tr>
                                    <td colspan="3">{{ item.organizerName }}</td> // 初期使用者不在意？
                                </tr> -->
                            </table>
                            <!-- <span>
                                台北市
                            </span>
                            <span>
                                {{ item.name }}
                            </span>
                            <span class="footer__offer">
                                NTD 250
                            </span> -->
                        </template>
                    </MoleculeVenoniaCard>
                </el-col>
            </el-row>
        </el-col>
        <!-- {{ eventList }} -->
    </el-row>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default'
})
import type { IEvent, IEventQuery } from '~/types/event';
// import placeholderImage from '@/assets/mock/eventImage.png'
const id = ref<string>(crypto.randomUUID())
const repoUI = useRepoUI()
const repoEvent = useRepoEvent()
const isLoading = ref<boolean>(false)

// Data
const eventList = ref<IEvent[]>([])
const startDate = new Date()
const currentMonth = new Date().getMonth()
const endDate = new Date()
endDate.setMonth(currentMonth + 1)
const formRef = ref()
const form = ref<IEventQuery>({
    keywords: '',
    startDate: startDate,
    endDate: endDate,
    startHour: '',
    locationAddressRegion: '',
    hasVirtualLocation: true,
    isPublic: true,
})

// Hooks
onMounted(() => {
    getEventList()
})

const searchFromSize = ref<number>(6)
const cardGroupSize = ref<number>(24)
const cardSize = ref<number>(8)
watch(() => repoUI, (ui) => {
    const { isSmall, isMedium, isLarge, isXLarge } = ui
    if (!isSmall) {
        searchFromSize.value = 6
        cardGroupSize.value = 24
        cardSize.value = 24
    } else {
        cardSize.value = 12
    }
    if (isMedium) {
        cardSize.value = 8
        cardGroupSize.value = 24
    }
    if (isLarge) {
        cardGroupSize.value = 18
    }
    if (isXLarge) {
        cardSize.value = 8
    }
}, { immediate: true, deep: true })

// Methods
function getDate(event: IEvent) {
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const date = startDate.toLocaleDateString('zh-TW')
        return date
    }
}

function getTimes(event: IEvent) {
    let timeString = ''
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const startTime = startDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += `${startTime.slice(0, 5)}`
    }
    if (event.endDate) {
        const endDate: Date = new Date(event.endDate)
        const endTime = endDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += ` ~ ${endTime.slice(0, 5)}`
    }
    return timeString
}

async function getEventList() {
    const isValid = await formRef.value?.validate()
    if (!isValid) {
        return
    }
    isLoading.value = true
    repoUI.debounce(`${id.value}-search`, async () => {
        const startDate = form.value.startDate
        startDate?.setHours(0, 0, 0, 0)
        const endDate = form.value.endDate
        endDate?.setHours(24, 0, 0, 0)
        const result = await repoEvent.getEventList(form.value)
        eventList.value = [...result, ...result,]
        isLoading.value = false
    }, 500)
}
</script>

<style lang="scss" scoped>
.events {

    .events__form {
        z-index: 10;
    }

    .events__form--mobile {
        width: calc(100vw - 40px);
        position: fixed;
        top: 0px;
        left: 0px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid lightgrey;
    }

    .events__sideContainer {
        z-index: 20;
        position: fixed;
        width: calc((100% - 64px) / 4);
        max-width: 304px;

        .sideContainer__card {
            width: 100%;
        }

        .sideContainer__ads {
            border: 1px solid black;
            height: calc(100vh - 460px);
        }
    }



    .events__mainContainer {
        // padding: 70px 0px;
        // max-height: calc(100vh - 100px);
    }

    .events__mainContainer--mt-0 {
        padding: 0px;

    }
}

.card__image {
    background-position: center;
    width: 100%;
    display: block;
}

.index__cardWrap {
    margin-bottom: 8px;
}

.card__footTable {
    width: 100%;
    min-height: 125px;
    text-align: justify;

    .table__row {
        display: flex;
        justify-content: space-between;
        width: 100%;

        * {
            width: 33%;
        }
    }

    .table__time {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;

        .time__span {
            text-wrap: nowrap;
        }
    }

    .table__logo {
        width: 40px;
        border: 1px solid black;
        border-radius: 50%;
        display: block;
        margin-left: auto;
    }

    .footer__offer {
        white-space: nowrap;
        text-align: right;
        width: 100%;
    }
}
</style>