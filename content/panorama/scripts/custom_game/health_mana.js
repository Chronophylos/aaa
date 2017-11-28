/* global FindDotaHudElement, GameEvents, $, Players, CustomNetTables */
'use strict';

(function () {
  GameEvents.Subscribe('dota_portrait_unit_stats_changed', HandleStatChange);
  GameEvents.Subscribe('player_stats_updated', HandleStatChange);
  GameEvents.Subscribe('dota_portrait_unit_modifiers_changed', HandleStatChange);
  GameEvents.Subscribe('dota_inventory_changed', HandleStatChange);
  GameEvents.Subscribe('dota_inventory_item_changed', HandleStatChange);
  GameEvents.Subscribe('dota_inventory_changed_query_unit', HandleStatChange);
}());

var HealthManaContainer = FindDotaHudElement('HealthManaContainer');
var HealthRegenLabel = HealthManaContainer.FindChildTraverse('HealthRegenLabel');
var ManaRegenLabel = HealthManaContainer.FindChildTraverse('ManaRegenLabel');
var recentlyFired = false;

function HandleStatChange () {
  if (recentlyFired) return;
  else recentlyFired = true;

  var entity = Players.GetLocalPlayerPortraitUnit();
  GameEvents.SendCustomGameEventToServer('statprovider_entities_request', {
    entity: entity
  });
  $.Schedule(0.1, function () {
    UpdateRegenDisplays(entity);
    recentlyFired = false;
  });
}

function UpdateRegenDisplays (entity) {
  if (entity === null) {
    $.Msg('[Error] Variable \'entity\' is null');
  }
  var stats = CustomNetTables.GetTableValue('entity_stats', String(entity));

  HealthRegenLabel.text = FormatRegen(stats['HealthRegen']);
  ManaRegenLabel.text = FormatRegen(stats['ManaRegen']);
}

function FormatRegen (number) {
  error('Variable \'number\' is not a number');
  if (number > 0) {
    number = '+' + number.toFixed(3);
  } else if (number < 0) {
    number = '-' + number.toFixed(3);
  } else if (number === 0) { // this may occur
    number = '±0.00';
  } else { // this should never occur (apparently it did)
    error('Variable \'number\' is not a number');
    number = 'error';
  }

  return number;
}
