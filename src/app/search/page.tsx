// See all professors (for certain school)

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfessorCard from "@/components/search/ProfessorCard";
import { cn } from "@/lib/utils";

export default function Professors() {
  const [search, setSearch] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [professors, setProfessors] = useState<{
    messages: string[];
    profIds: string[];
  }>({ messages: [], profIds: [] });
  const [queryResult, setQueryResult] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  async function chat(content: string) {
    setLoading(true);
    toast({
      title: "Searching for professors...",
      description: "Please wait while we find the best professors for you.",
    });
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ content: content }],
        schoolId: selectedSchool!.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: chatRes = await res.json();
    if (data) {
      setProfessors({ messages: data.messages, profIds: data.professors });
      console.log(data);
    } else {
      toast({
        title: "Error",
        description: "An error occurred while searching for professors.",
      });
    }
    setLoading(false);
  }

  // fetch professors
  useEffect(() => {
    if (professors.profIds.length !== 0) {
      setLoading(true);

      let topKProfessors: Professor[] = [];
      const supabase = createClient();

      (async () => {
        const promises = professors.profIds.map(async (profId) => {
          const { data, error } = await supabase
            .from("professors")
            .select()
            .eq("id", profId)
            .single();
          if (error) {
            toast({
              title: "Error",
              description: "An error occurred while fetching professor data.",
            });
          }
          return data;
        });

        topKProfessors = await Promise.all(promises);
        setQueryResult(topKProfessors);
        setLoading(false);
        toast({
          title: "Success",
          description: "Scroll down to see professors!",
        });
      })();
    }
  }, [professors]);

  // debounce school search
  const debouncedSetSchoolSearch = debounce((value) => {
    setSchoolSearch(value);
  }, 500);

  // search for school
  useEffect(() => {
    (async () => {
      setLoading(true);

      const supabase = createClient();
      const { data, error } = await supabase
        .from("schools")
        .select()
        .ilike("name", `%${schoolSearch}%`);

      if (error) {
        toast({
          title: "Error",
          description: "An error occurred while searching for schools.",
        });
        setLoading(false);
        return;
      }

      setSchools(data || []);
      setLoading(false);
    })();
  }, [schoolSearch]);

  // scroll to results
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [queryResult]);

  return (
    <>
      {/* Pick school */}
      {!selectedSchool && (
        <section className='-my-20 pb-20 h-screen flex flex-col p-8 items-center justify-center gap-8'>
          <Label
            className='flex flex-col gap-4 items-center'
            htmlFor='find-school'>
            <h1 className='text-4xl font-semibold'>
              What school do you go to?
            </h1>
            <h2 className='text-xl'>
              Type in the search box to filter through our database of schools.
            </h2>
          </Label>
          <div className='md:w-3/5 w-full relative'>
            <div className='absolute w-full rounded-md border border-primary/30'>
              <Input
                placeholder='Type the name of your school to search...'
                className='border-none focus-visible:ring-0'
                onChange={(e) => debouncedSetSchoolSearch(e.target.value)}
                onFocus={() => setIsListVisible(true)}
                onBlur={() => setTimeout(() => setIsListVisible(false), 400)}
              />
              {isListVisible && (
                <div className='flex flex-col text primary/60'>
                  {loading ? (
                    <></>
                  ) : schools ? (
                    <>
                      {schools.map((school, i) => (
                        <div
                          key={school.id}
                          className={cn(
                            "px-2 py-1 cursor-pointer hover:bg-muted transition-colors",
                            i === schools.length - 1 && "rounded-b-md"
                          )}
                          onClick={() => {
                            setSelectedSchool(school);
                            setIsListVisible(false);
                          }}>
                          {`${school.name}, ${school.city}, ${school.state}`}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className='bg-muted px-2 py-1'>No schools found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Query for professors */}
      {selectedSchool && (
        <>
          <section className='-my-20 h-screen flex flex-col p-8 items-center justify-center gap-8'>
            <Label
              className='flex flex-col gap-4 items-center'
              htmlFor='find-professor'>
              <h1 className='text-4xl font-semibold'>
                Find the right professor at{" "}
                <span
                  className='underline'
                  onClick={() => setSelectedSchool(null)}>
                  {selectedSchool.name}
                </span>
              </h1>
              <h2 className='text-xl'>
                Use natural language and let our algorithm do the rest.
              </h2>
            </Label>

            <div className='md:w-3/5 w-full flex items-center gap-1'>
              <Input
                id='find-professor'
                placeholder='Find a professor that explains complex topics well'
                disabled={loading}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={async (e) => {
                  if (!loading && e.key === "Enter") {
                    if (search === "") {
                      toast({
                        title: "Invalid query!",
                        description: "Please enter a query to search for.",
                      });
                      return;
                    }
                    await chat(search);
                    setSearch("");
                  }
                }}
              />
              <Button
                variant={"secondary"}
                disabled={loading}
                onClick={async () => {
                  // search for professors
                  if (search === "") {
                    toast({
                      title: "Invalid query!",
                      description: "Please enter a query to search for.",
                    });
                    return;
                  }
                  await chat(search);
                  setSearch("");
                }}>
                <Search size={24} />
              </Button>
            </div>
          </section>
          {/* top 3 professors with explanation after search is done */}
          {queryResult.length !== 0 && (
            <section
              id='results'
              ref={resultsRef}
              className='p-8 min-h-screen flex flex-col gap-4 scroll-mt-20'>
              <div className='flex flex-col gap-2'>
                <h1 className='text-4xl font-semibold'>
                  Top professors for you
                </h1>
                <h2 className='text-xl'>
                  Based on your query, we found the following professors that
                  match your criteria.
                </h2>
              </div>
              <div className='flex flex-col gap-4'>
                {queryResult.map((prof, i) => {
                  // get professor data
                  return (
                    <ProfessorCard
                      key={Number(prof.id)}
                      prof={prof}
                      message={professors.messages[i]}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

type chatRes = {
  messages: string[];
  professors: string[];
};
