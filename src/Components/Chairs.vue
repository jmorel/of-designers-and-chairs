<template>
    <div>
        <figure v-for="chairRecord in chairRecords">
            <img v-bind:src="chairRecord.fields.chair_picture.url"
                    v-bind:alt="chairRecord.fields.chair_caption_text">
            <figcaption v-html="chairRecord.fields.chair_caption_html"></figcaption>
        </figure>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {buildGetUrl, baseUrl, datasetId} from '../utils';

export default {
    data: function () {
        return {
            chairRecords: []
        }
    },
    computed: mapState(['currentDesigner']),
    created: function () {
        this.fetchImages();
    },
    watch: {
        'currentDesigner': 'fetchImages',
    },
    methods: {
        fetchImages: function () {
            var that = this;
            this.chairRecords = [];
            var imagesUrl = buildGetUrl(baseUrl + '/api//records/1.0/search', {
                'dataset': datasetId,
                'sort': 'last_name',
                'rows': 10000,
                'q': 'full_name:' + this.currentDesigner
            });
            fetch(imagesUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (response) {
                    response.records.forEach(function (record) {
                        record.fields.chair_picture.url = baseUrl + '/explore/dataset/' + datasetId + '/files/' + record.fields.chair_picture.id + '/300/';
                    });
                    that.chairRecords = response.records;
                });
        }
    }
}
</script>