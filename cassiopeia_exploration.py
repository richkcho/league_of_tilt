import random

from cassiopeia import riotapi

riotapi.set_region("NA")
riotapi.set_api_key("b14dad6b-9637-43ed-9ec6-57cdcf59a67c")

summoner = riotapi.get_summoner_by_name("Crazy Anarchist")
#print [method for method in dir(summoner) if callable(getattr(summoner, method))]

print summoner.rune_pages()[0]