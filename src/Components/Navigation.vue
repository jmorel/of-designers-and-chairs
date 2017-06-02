<template>
            <nav v-bind:class="{expanded: expanded}">
               <button class="nav-toggle" v-on:click="expanded = !expanded">
                   <i class="icon-menu"></i>
               </button>
               <div>
                   <div class="current-designer">{{ currentDesigner || 'Select a designer' }}</div>
                   <div class="designer-index">
                       <div class="designer-index-section" v-for="(designers, letter) in designerIndex">
                           <div class="designer-index-section-title">{{ letter }}</div>
                           <ul class="designer-index-designers">
                               <li class="designer" v-for="designer in designers">
                                    <a :href="'#' + designer">{{ designer }}</a>
                               </li>
                           </ul>
                       </div>
                   </div>
               </div>
            </nav>
</template>

<script>

import {mapState} from 'vuex';
import {buildGetUrl, baseUrl, datasetId} from '../utils';

export default {
    data: function () {
        return {
            designerIndex: 'abcdefghijklmnopqrstuvwxyz'
                .split('')
                .reduce(function (object, letter) {
                    object[letter] = [];
                    return object;
                }, {}),
            expanded: !this.currentDesigner
        }
    },
    created: function () {
        var designersUrl = buildGetUrl(baseUrl + '/api/records/1.0/analyze/', {
            'dataset': datasetId,
            'x': ['last_name', 'full_name'],
            'sort': 'x.last_name,x.full_name',
            'y.serie1-1.func': 'COUNT'
        });
        var that = this;
        fetch(designersUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (designers) {
                designers.forEach(function (designer) {
                    that.designerIndex[designer.x.last_name[0].toLowerCase()].push(designer.x.full_name);
                });
            });
    },
    computed: mapState(['currentDesigner']),
    watch: {
        'currentDesigner': function () {
            this.expanded = false;
        }
    }
}
</script>